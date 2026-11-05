const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class Element {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.children = [];
        this.style = {};
        this.listeners = new Map();
        this.classList = new Set();
        this.classList.contains = this.classList.has.bind(this.classList);
    }
    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
        return child;
    }
    append(...children) { children.forEach(child => this.appendChild(child)); }
    remove() {
        if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1);
        this.parentNode = null;
    }
    attachShadow() { return this.shadowRoot = new Element('shadow-root'); }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(type, handler) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type).add(handler);
    }
    removeEventListener(type, handler) { this.listeners.get(type)?.delete(handler); }
    listenerCount(type) { return this.listeners.get(type)?.size || 0; }
    dispatch(type, data = {}) {
        const event = { target: this, currentTarget: this, button: 0, clientX: 200, clientY: 100,
            preventDefault() {}, stopPropagation() {}, composedPath: () => [this], ...data };
        for (const handler of [...this.listeners.get(type) || []]) handler(event);
    }
    querySelectorAll(selector) {
        const matches = [];
        const visit = element => {
            for (const child of element.children) {
                if (selector.startsWith('#') ? child.id === selector.slice(1)
                    : selector.startsWith('.') ? child.classList.has(selector.slice(1))
                    : child.tagName.toLowerCase() === selector) matches.push(child);
                visit(child);
            }
        };
        visit(this);
        return matches;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    set innerHTML(html) {
        this.children = [];
        for (const match of html.matchAll(/<button\s+id="([^"]+)"/g)) {
            const button = new Element('button');
            button.id = match[1];
            this.appendChild(button);
        }
    }
    getBoundingClientRect() {
        const left = Number.parseFloat(this.style.left) || 20;
        const top = Number.parseFloat(this.style.top) || 20;
        return { left, top, width: 298, height: 40, right: left + 298, bottom: top + 40 };
    }
    get offsetLeft() { return this.getBoundingClientRect().left; }
    get offsetTop() { return this.getBoundingClientRect().top; }
    get parentElement() { return this.parentNode; }
    closest(selector) {
        for (let element = this; element; element = element.parentElement) {
            if (selector.startsWith('.') && element.classList.has(selector.slice(1))) return element;
        }
        return null;
    }
    contains(target) { return target === this || this.children.some(child => child.contains(target)); }
}

class LGraphNode {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        this.pos = [x, y];
        this.size = [width, height];
        this.resizeCount = 0;
    }
    setSize(size) {
        this.resizeCount++;
        this.size = [...size];
    }
}

function load(nodes = []) {
    const document = new Element('document');
    document.body = new Element('body');
    document.createElement = tag => new Element(tag);
    document.getElementById = id => document.body.querySelector(`#${id}`);
    document.querySelector = selector => selector === 'canvas#graph-canvas' ? null : document.body.querySelector(selector);
    const window = new Element('window');
    Object.assign(window, { innerWidth: 1600, innerHeight: 900, LGraphNode });
    const storage = new Map();
    const writes = [];
    const history = [];
    const frames = new Map();
    let nextFrame = 0;
    const canvas = {
        selectedItems: new Set(nodes),
        selected_nodes: Object.fromEntries(nodes.map((node, index) => [index, node])),
        ds: { offset: [0, 0], scale: 2 },
        canvas: new Element('canvas'),
        graph: { beforeChange() { history.push('before'); }, afterChange() { history.push('after'); } },
        setDirty() {},
    };
    const canvasParent = document.body.appendChild(new Element('div'));
    canvasParent.appendChild(canvas.canvas);
    const extensions = [];
    const app = { canvas, graph: canvas.graph, registerExtension(extension) { extensions.push(extension); } };
    const context = vm.createContext({
        app, document, window, LGraphNode, LGraphCanvas: { active_canvas: canvas }, console,
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem(key, value) { storage.set(key, value); writes.push(key); },
        },
        setTimeout() {}, clearTimeout() {},
        requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
        cancelAnimationFrame(id) { frames.delete(id); },
    });
    const source = fs.readFileSync(path.join(__dirname, '..', 'node_info.js'), 'utf8')
        .replace(/^import\s+.*?;\s*$/gm, '');
    vm.runInContext(`${source}\nglobalThis.manager = ButtonManager;`, context);
    const flushFrames = () => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(callback => callback());
    };
    return { manager: context.manager, app, canvas, context, extensions, document, window, writes, history, storage, flushFrames };
}

let failures = 0;
let checks = 0;
function test(name, check) {
    checks++;
    try { check(); console.log(`PASS ${name}`); }
    catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
}

test('registers with ComfyUI and initializes only once', () => {
    const { manager, extensions, document } = load();
    assert.equal(extensions.length, 1);
    assert.equal(typeof extensions[0].setup, 'function');
    extensions[0].setup();
    manager.init();
    assert.equal(document.body.querySelectorAll('#alignment-buttons').length, 1);
    for (const button of manager.buttonContainer.shadowRoot.querySelectorAll('.custom-button')) {
        assert.ok(button.title && button.title !== 'undefined');
        assert.equal(button['aria-label'], button.title);
    }
});

test('uses the current canvas selectedItems and excludes groups and reroutes', () => {
    const node = new LGraphNode();
    const { manager, canvas, context } = load([node]);
    canvas.selectedItems.add({ pos: [5, 5], size: [100, 100] });
    canvas.selected_nodes = { stale: new LGraphNode() };
    context.LGraphCanvas.active_canvas = null;
    assert.deepEqual([...manager.getSelectedNodes()], [node]);
    canvas.selectedItems.clear();
    assert.equal(manager.getSelectedNodes().length, 0);
});

test('supports the legacy selected_nodes object', () => {
    const node = new LGraphNode();
    const { manager, canvas } = load([node]);
    delete canvas.selectedItems;
    assert.deepEqual([...manager.getSelectedNodes()], [node]);
});

test('records one graph change around a toolbar action', () => {
    const first = new LGraphNode(10, 20);
    const second = new LGraphNode(100, 80);
    const { manager, history, canvas } = load([first, second]);
    const canvasChanges = [];
    canvas.graph.beforeChange = () => { assert.equal(second.pos[0], 100); history.push('before'); };
    canvas.graph.afterChange = () => { assert.equal(second.pos[0], 10); history.push('after'); };
    canvas.emitBeforeChange = () => canvasChanges.push('before');
    canvas.emitAfterChange = () => canvasChanges.push('after');
    manager.runAction(manager.alignLeft);
    assert.deepEqual(history, ['before', 'after']);
    assert.deepEqual(canvasChanges, ['before', 'after']);
});

test('toolbar actions are safe without a canvas', () => {
    const { manager, app, context } = load();
    app.canvas = null;
    context.LGraphCanvas.active_canvas = null;
    assert.equal(manager.getSelectedNodes().length, 0);
    for (const button of manager.getButtons().filter(button => button.action)) manager.runAction(button.action);
});

test('resetting an empty canvas does not enter workflow history', () => {
    const { manager, canvas, history } = load();
    manager.runAction(manager.alignLeft);
    assert.deepEqual([...canvas.ds.offset], [80, 140]);
    assert.equal(canvas.ds.scale, 1);
    assert.deepEqual(history, []);
});

test('equal sizes use setSize, round to five and preserve the other dimension', () => {
    for (const [action, expected] of [
        ['equalWidth', [[305, 203], [305, 251]]],
        ['equalMinWidth', [[210, 203], [210, 251]]],
        ['equalHeight', [[211, 250], [303, 250]]],
        ['equalMinHeight', [[211, 205], [303, 205]]],
    ]) {
        const nodes = [new LGraphNode(0, 0, 211, 203), new LGraphNode(0, 0, 303, 251)];
        const { manager } = load(nodes);
        manager.runAction(manager[action]);
        assert.deepEqual(nodes.map(node => node.size), expected, action);
        assert.deepEqual(nodes.map(node => node.resizeCount), [1, 1], action);
    }
});

test('preserves the six alignment operations', () => {
    for (const [action, axis, positions] of [
        ['alignLeft', 0, [10, 10]], ['alignRight', 0, [250, 200]],
        ['alignTop', 1, [20, 20]], ['alignBottom', 1, [100, 80]],
        ['alignCenterVertically', 0, [130, 105]],
        ['alignCenterHorizontally', 1, [60, 50]],
    ]) {
        const nodes = [new LGraphNode(10, 20, 100, 100), new LGraphNode(200, 80, 150, 120)];
        const { manager } = load(nodes);
        manager.runAction(manager[action]);
        assert.deepEqual(nodes.map(node => node.pos[axis]), positions, action);
    }
});

for (const count of [4, 8]) {
    for (const [action, axis, anchor] of [
        ['alignLeft', 0, 0], ['alignRight', 0, 1],
        ['alignTop', 1, 0], ['alignBottom', 1, 1],
        ['alignCenterVertically', 0, 0.5], ['alignCenterHorizontally', 1, 0.5],
    ]) {
        test(`${action} aligns all ${count} selected nodes in one transaction`, () => {
            const nodes = Array.from({ length: count }, (_, index) => {
                const position = index === count - 1 ? 420 : 100;
                return axis === 0
                    ? new LGraphNode(position, index * 250, 100 + index * 10, 80 + index * 7)
                    : new LGraphNode(index * 250, position, 80 + index * 7, 100 + index * 10);
            });
            const minimum = Math.min(...nodes.map(node => node.pos[axis]));
            const maximum = Math.max(...nodes.map(node => node.pos[axis] + node.size[axis]));
            const target = minimum + (maximum - minimum) * anchor;
            const otherPositions = nodes.map(node => node.pos[1 - axis]);
            const sizes = nodes.map(node => [...node.size]);
            const { manager, history } = load(nodes);
            manager.runAction(manager[action]);
            assert.deepEqual(nodes.map(node => node.pos[axis] + node.size[axis] * anchor), nodes.map(() => target));
            assert.deepEqual(nodes.map(node => node.pos[1 - axis]), otherPositions);
            assert.deepEqual(nodes.map(node => node.size), sizes);
            assert.deepEqual(history, ['before', 'after']);
        });
    }
}

test('preserves horizontal and vertical distribution', () => {
    const horizontal = [new LGraphNode(0, 0, 100), new LGraphNode(200, 0, 50), new LGraphNode(400, 0, 150)];
    const first = load(horizontal);
    first.manager.runAction(first.manager.horizontalDistribution);
    assert.deepEqual(horizontal.map(node => node.pos[0]), [0, 225, 400]);
    const vertical = [new LGraphNode(0, 0, 100, 100), new LGraphNode(0, 200, 100, 150), new LGraphNode(0, 500, 100, 200)];
    const second = load(vertical);
    second.manager.runAction(second.manager.verticalDistribution);
    assert.deepEqual(vertical.map(node => node.pos[1]), [0, 225, 500]);
});

test('preserves grid tracks, selection order and repeated alignment or distribution', () => {
    const grid = [0, 300, 900].flatMap(y => [0, 400, 1000].map(x => [x, y, 100, 100]));
    const layouts = [
        {
            name: 'irregular 2x3',
            data: [[100, 100, 120, 80], [630, 110, 180, 100], [1210, 90, 100, 120],
                [120, 520, 160, 110], [610, 500, 120, 140], [1200, 530, 200, 90]],
            expected: {
                alignLeft: [0, [100, 630, 1210, 100, 630, 1210]],
                alignRight: [0, [160, 630, 1300, 120, 690, 1200]],
                alignCenterVertically: [0, [130, 620, 1250, 110, 650, 1200]],
                alignTop: [1, [100, 100, 100, 520, 520, 520]],
                alignBottom: [1, [130, 110, 90, 530, 500, 550]],
                alignCenterHorizontally: [1, [110, 100, 90, 515, 500, 525]],
                horizontalDistribution: [0, [100, 625, 1210, 120, 680, 1200]],
                verticalDistribution: [1, [100, 110, 90, 520, 500, 530]],
            },
        },
        { name: '3x3', data: grid,
            horizontal: [0, 500, 1000, 0, 500, 1000, 0, 500, 1000],
            vertical: [0, 0, 0, 450, 450, 450, 900, 900, 900] },
        { name: '3x3 missing center', data: grid.filter((_, index) => index !== 4),
            horizontal: [0, 500, 1000, 0, 1000, 0, 500, 1000],
            vertical: [0, 0, 0, 450, 450, 900, 900, 900] },
    ];
    for (const layout of layouts) {
        const indices = layout.data.map((_, index) => index);
        const orders = [indices, [...indices].reverse(),
            indices.filter(index => index % 2 === 0).reverse().concat(indices.filter(index => index % 2))];
        const expected = layout.expected || {
            alignLeft: [0, layout.data.map(node => node[0])],
            alignRight: [0, layout.data.map(node => node[0])],
            alignCenterVertically: [0, layout.data.map(node => node[0])],
            alignTop: [1, layout.data.map(node => node[1])],
            alignBottom: [1, layout.data.map(node => node[1])],
            alignCenterHorizontally: [1, layout.data.map(node => node[1])],
            horizontalDistribution: [0, layout.horizontal],
            verticalDistribution: [1, layout.vertical],
        };
        for (const [action, [axis, positions]] of Object.entries(expected)) {
            for (const order of orders) {
                const nodes = layout.data.map(node => new LGraphNode(...node));
                const { manager, history } = load(order.map(index => nodes[index]));
                const message = `${layout.name}, ${action}, selection ${order}`;
                manager.runAction(manager[action]);
                assert.deepEqual(nodes.map(node => node.pos[axis]), positions, message);
                assert.deepEqual(nodes.map(node => node.pos[1 - axis]), layout.data.map(node => node[1 - axis]), message);
                assert.deepEqual(nodes.map(node => node.size), layout.data.map(node => node.slice(2)), message);
                assert.deepEqual(history, ['before', 'after'], message);
                const first = nodes.map(node => [...node.pos]);
                manager.runAction(manager[action]);
                assert.deepEqual(nodes.map(node => node.pos), first, `${message}, repeated action`);
            }
        }
    }
});

test('keeps a tall singleton from changing the spacing of other columns', () => {
    const data = [[0, 0, 100, 100], [0, 300, 100, 100],
        [500, 0, 100, 150], [500, 500, 100, 100], [1000, 100, 100, 2000]];
    for (const order of [[0, 1, 2, 3, 4], [4, 3, 2, 1, 0], [2, 4, 1, 3, 0]]) {
        const nodes = data.map(node => new LGraphNode(...node));
        const { manager } = load(order.map(index => nodes[index]));
        manager.runAction(manager.verticalDistribution);
        assert.deepEqual(nodes.map(node => node.pos), data.map(node => node.slice(0, 2)));
    }
});

test('matches offset and incomplete grid rows using the top and left reference nodes', () => {
    const layouts = [
        { name: 'screenshot 2x3', data: [[90, 110], [590, 110], [1515, 190], [90, 470], [590, 550], [1175, 550]],
            xs: [90, 590, 1515, 90, 590, 1515], ys: [110, 110, 110, 470, 470, 470] },
        { name: 'screenshot missing B', data: [[90, 110], [1515, 190], [90, 470], [590, 550], [1175, 550]],
            xs: [90, 1515, 90, 590, 1515], ys: [110, 110, 470, 470, 470] },
        { name: 'two incomplete rows', data: [[90, 110], [590, 110], [590, 470], [1515, 470]],
            xs: [90, 590, 590, 1515], ys: [110, 110, 470, 470] },
    ];
    for (const layout of layouts) {
        const indices = layout.data.map((_, index) => index);
        const orders = [indices, [...indices].reverse(),
            indices.filter(index => index % 2 === 0).reverse().concat(indices.filter(index => index % 2))];
        for (const order of orders) {
            for (const sequence of [['alignLeft', 'alignTop'], ['alignTop', 'alignLeft']]) {
                const nodes = layout.data.map(([x, y]) => new LGraphNode(x, y, 280, 100));
                const { manager, history } = load(order.map(index => nodes[index]));
                for (const action of [...sequence, ...sequence]) {
                    const axis = action === 'alignLeft' ? 0 : 1;
                    const other = nodes.map(node => node.pos[1 - axis]);
                    const start = history.length;
                    const message = `${layout.name}, ${sequence}, selection ${order}, ${action}`;
                    manager.runAction(manager[action]);
                    assert.deepEqual(nodes.map(node => node.pos[axis]), axis === 0 ? layout.xs : layout.ys, message);
                    assert.deepEqual(nodes.map(node => node.pos[1 - axis]), other, message);
                    assert.deepEqual(nodes.map(node => node.size), nodes.map(() => [280, 100]), message);
                    assert.deepEqual(history.slice(start), ['before', 'after'], message);
                }
            }
        }
    }
});

test('expands overlapping heterogeneous nodes forward with a stable minimum gap', () => {
    for (const axis of [0, 1]) {
        const nodes = [[0, 0, 600], [10, 5, 50], [20, -4, 800]].map(([position, other, size]) =>
            axis === 0 ? new LGraphNode(position, other, size, 100) : new LGraphNode(other, position, 100, size));
        const { manager } = load(nodes);
        const action = axis === 0 ? manager.horizontalDistribution : manager.verticalDistribution;
        manager.runAction(action);
        assert.deepEqual(nodes.map(node => node.pos[axis]), [0, 620, 690]);
        assert.deepEqual(nodes.map(node => node.pos[1 - axis]), [0, 5, -4]);
        assert.deepEqual(nodes.map(node => node.size[axis]), [600, 50, 800]);
        const first = nodes.map(node => [...node.pos]);
        manager.runAction(action);
        assert.deepEqual(nodes.map(node => node.pos), first);
    }
});

test('all toolbar actions are safe with empty and single-node selections', () => {
    for (const nodes of [[], [new LGraphNode(120, 80, 235, 155)]]) {
        const { manager, history } = load(nodes);
        for (const button of manager.getButtons().filter(button => button.action)) manager.runAction(button.action);
        assert.deepEqual(nodes.map(node => [...node.pos, ...node.size]), nodes.length ? [[120, 80, 235, 155]] : []);
        if (!nodes.length) assert.deepEqual(history, []);
    }
});

test('keeps heterogeneous columns together without moving overlapping track references', () => {
    const singleColumn = [[0, 0, 400, 100], [0, 150, 400, 100], [10, 400, 200, 100], [10, 600, 200, 100]];
    for (const [action, axis, expected] of [
        ['alignLeft', 0, [0, 0, 0, 0]], ['verticalDistribution', 1, [0, 200, 400, 600]],
    ]) {
        const nodes = singleColumn.map(node => new LGraphNode(...node));
        const { manager } = load(nodes);
        manager.runAction(manager[action]);
        assert.deepEqual(nodes.map(node => node.pos[axis]), expected, action);
        assert.deepEqual(nodes.map(node => node.pos[1 - axis]), singleColumn.map(node => node[1 - axis]), action);
        const first = nodes.map(node => [...node.pos]);
        manager.runAction(manager[action]);
        assert.deepEqual(nodes.map(node => node.pos), first, `${action}, repeated action`);
    }
    const overlapping = [[50, 0, 100, 100], [-100, 300, 400, 100], [250, 0, 100, 100], [-50, 300, 700, 100]];
    for (const axis of [0, 1]) {
        for (const [action, anchor] of axis === 0
            ? [['alignLeft', 0], ['alignRight', 1], ['alignCenterVertically', 0.5]]
            : [['alignTop', 0], ['alignBottom', 1], ['alignCenterHorizontally', 0.5]]) {
            const data = overlapping.map(node => axis === 0 ? node : [node[1], node[0], node[3], node[2]]);
            const nodes = data.map(node => new LGraphNode(...node));
            const { manager } = load(nodes);
            manager.runAction(manager[action]);
            const aligned = nodes.map(node => node.pos[axis] + node.size[axis] * anchor);
            assert.equal(aligned[0], aligned[1], action);
            assert.equal(aligned[2], aligned[3], action);
            const targets = anchor === 0 ? [50, 250] : anchor === 1 ? [300, 650] : [100, 300];
            assert.deepEqual(aligned, [targets[0], targets[0], targets[1], targets[1]], `${action}, original track references`);
            if (anchor === 0) {
                assert.deepEqual(nodes.map(node => node.pos[axis]), [50, 50, 250, 250], action);
                assert.deepEqual([nodes[0].pos[axis], nodes[2].pos[axis]], [data[0][axis], data[2][axis]], action);
            }
            assert.deepEqual(nodes.map(node => node.pos[1 - axis]), data.map(node => node[1 - axis]), action);
            const first = nodes.map(node => [...node.pos]);
            manager.runAction(manager[action]);
            assert.deepEqual(nodes.map(node => node.pos), first, `${action}, repeated action`);
        }
    }
    const xs = [-20, -20, 20, 20, 540, 520, 540, 500];
    const widths = [300, 180, 360, 360, 300, 300, 300, 360];
    const ys = [10, 290, 570, 840, -10, 290, 560, 830];
    const heights = [180, 140, 180, 100, 180, 180, 140, 140];
    const nodes = xs.map((x, index) => new LGraphNode(x, ys[index], widths[index], heights[index]));
    const { manager } = load(nodes);
    manager.runAction(manager.alignCenterVertically);
    const centers = nodes.map(node => node.pos[0] + node.size[0] / 2);
    assert.deepEqual(centers.slice(0, 4), Array(4).fill(centers[0]));
    assert.deepEqual(centers.slice(4), Array(4).fill(centers[4]));
    assert.ok(centers[0] < centers[4]);
    assert.deepEqual(nodes.map(node => node.pos[1]), ys);
    const first = nodes.map(node => [...node.pos]);
    manager.runAction(manager.alignCenterVertically);
    assert.deepEqual(nodes.map(node => node.pos), first, '2-column center alignment, repeated action');
});

test('keeps wide and narrow tracks separate after repeated right alignment', () => {
    const xs = [0, 0, 0, 650, 650, 650, 650, 1280, 1300];
    const widths = [900, 900, 900, 900, 900, 600, 180, 180, 180];
    let expected;
    for (const order of [[0, 1, 2, 3, 4, 5, 6, 7, 8], [8, 7, 6, 5, 4, 3, 2, 1, 0], [6, 2, 8, 0, 5, 3, 7, 1, 4]]) {
        const nodes = xs.map((x, index) => new LGraphNode(x, index * 200, widths[index], 100));
        const { manager } = load(order.map(index => nodes[index]));
        manager.runAction(manager.alignRight);
        const rights = nodes.map(node => node.pos[0] + node.size[0]);
        assert.deepEqual(rights.slice(0, 3), Array(3).fill(rights[0]));
        assert.deepEqual(rights.slice(3, 7), Array(4).fill(rights[3]));
        assert.deepEqual(rights.slice(7), Array(2).fill(rights[7]));
        assert.deepEqual(rights, [900, 900, 900, 1550, 1550, 1550, 1550, 1480, 1480]);
        const first = nodes.map(node => [...node.pos]);
        if (expected) assert.deepEqual(first, expected, 'selection order');
        expected = first;
        manager.runAction(manager.alignRight);
        assert.deepEqual(nodes.map(node => node.pos), first, 'repeated right alignment');
    }
});

test('uses rendered bounds for alignment and distribution without changing stored sizes', () => {
    for (const axis of [0, 1]) {
        const actions = axis === 0
            ? ['alignRight', 'alignCenterVertically', 'horizontalDistribution']
            : ['alignBottom', 'alignCenterHorizontally', 'verticalDistribution'];
        const expected = [[820, 750, 800], [410, 375, 400], [0, 365, 800]];
        for (const [index, action] of actions.entries()) {
            const nodes = [0, 300, 800].map((position, nodeIndex) => {
                const node = axis === 0 ? new LGraphNode(position, 0) : new LGraphNode(0, position);
                const rendered = [180, 250, 200][nodeIndex];
                node.renderingSize = axis === 0 ? [rendered, 100] : [100, rendered];
                return node;
            });
            const { manager } = load(nodes);
            manager.runAction(manager[action]);
            assert.deepEqual(nodes.map(node => node.pos[axis]), expected[index], action);
            assert.deepEqual(nodes.map(node => node.pos[1 - axis]), [0, 0, 0], action);
            assert.deepEqual(nodes.map(node => node.size), [[100, 100], [100, 100], [100, 100]], action);
        }
    }
});

test('left alignment keeps established reference nodes and the viewport fixed even with oversized rendered bounds', () => {
    for (const oversizedMiddle of [false, true]) {
        const nodes = [0, 200].flatMap(y => [100, 400, 700].map(x => {
            const node = new LGraphNode(x, y, 600, 100);
            if (oversizedMiddle && x === 400) node.renderingSize = [3000, 100];
            return node;
        }));
        const { manager, canvas, history } = load(nodes);
        canvas.ds.offset = [23, -45];
        canvas.ds.scale = 0.7;
        const positions = nodes.map(node => [...node.pos]);
        const view = { offset: [...canvas.ds.offset], scale: canvas.ds.scale };
        manager.runAction(manager.alignLeft);
        const message = oversizedMiddle ? 'oversized middle-column renderingSize' : 'already aligned 600-wide nodes';
        assert.deepEqual(nodes.map(node => node.pos), positions, message);
        assert.deepEqual(nodes.slice(0, 3).map(node => node.pos[0]), [100, 400, 700], message);
        assert.deepEqual(nodes.map(node => node.size), nodes.map(() => [600, 100]), message);
        assert.deepEqual({ offset: [...canvas.ds.offset], scale: canvas.ds.scale }, view, message);
        assert.deepEqual(history, ['before', 'after'], message);
    }
});

test('aligns the actual 270x58 TextToUppercase screenshot without moving reference nodes or the viewport', () => {
    const xs = [2033.9313086979191, 2537.2539494739226, 3456.8149269557543,
        2033.9313086979191, 2537.2539494739226, 3118.3149269557543];
    const ys = [445.01567512710415, 445.01567512710415, 523.0156751271041,
        798.8750307067206, 876.8750307067206, 876.8750307067206];
    const expectedX = [xs[0], xs[1], xs[2], xs[0], xs[1], xs[2]];
    const expectedY = [ys[0], ys[0], ys[0], ys[3], ys[3], ys[3]];
    const nodes = xs.map((x, index) => new LGraphNode(x, ys[index], 270, 58));
    const { manager, canvas, history } = load(nodes);
    canvas.ds.offset = [12.5, -45.75];
    canvas.ds.scale = 0.7;
    const view = { offset: [...canvas.ds.offset], scale: canvas.ds.scale };
    for (const action of ['alignLeft', 'alignTop', 'alignLeft', 'alignTop']) {
        const axis = action === 'alignLeft' ? 0 : 1;
        const other = nodes.map(node => node.pos[1 - axis]);
        const start = history.length;
        manager.runAction(manager[action]);
        assert.deepEqual(nodes.map(node => node.pos[axis]), axis === 0 ? expectedX : expectedY, action);
        assert.deepEqual(nodes.map(node => node.pos[1 - axis]), other, action);
        assert.deepEqual(nodes.slice(0, 3).map(node => node.pos[0]), xs.slice(0, 3), 'top-row X reference positions');
        assert.deepEqual(nodes.map(node => node.size), nodes.map(() => [270, 58]), action);
        assert.deepEqual({ offset: [...canvas.ds.offset], scale: canvas.ds.scale }, view, action);
        assert.deepEqual(history.slice(start), ['before', 'after'], action);
    }
});

test('drag listeners exist only during dragging and ordinary mouseup never saves', () => {
    const { manager, document, writes } = load();
    manager.init();
    const dividers = manager.buttonContainer.shadowRoot.querySelectorAll('.divider');
    assert.equal(dividers.length, 3);
    assert.equal(document.listenerCount('mousemove'), 0);
    assert.equal(document.listenerCount('mouseup'), 0);
    const initialWrites = writes.length;
    manager.onDragEnd();
    assert.equal(writes.length, initialWrites);
    for (const divider of dividers) {
        divider.dispatch('mousedown');
        assert.equal(document.listenerCount('mousemove'), 1);
        assert.equal(document.listenerCount('mouseup'), 1);
        document.dispatch('mousemove', { clientX: 230, clientY: 120 });
        document.dispatch('mouseup');
        assert.equal(document.listenerCount('mousemove'), 0);
        assert.equal(document.listenerCount('mouseup'), 0);
    }
    assert.equal(writes.length - initialWrites, 3);
});

test('temporary toolbar dragging does not overwrite the pinned position', () => {
    const { manager, document, writes, storage } = load();
    manager.init();
    const divider = manager.buttonContainer.shadowRoot.querySelector('.divider');
    divider.dispatch('mousedown');
    document.dispatch('mousemove', { clientX: 350, clientY: 220 });
    document.dispatch('mouseup');
    const pinned = storage.get('NodeAlignerButtonContainerPosition');
    manager.isPermanent = false;
    manager.setPosition(700, 500);
    const initialWrites = writes.length;
    divider.dispatch('mousedown');
    document.dispatch('mousemove', { clientX: 220, clientY: 120 });
    document.dispatch('mouseup');
    assert.equal(writes.length, initialWrites);
    assert.equal(storage.get('NodeAlignerButtonContainerPosition'), pinned);
    manager.buttonContainer.shadowRoot.querySelector('#pin-mode').dispatch('click');
    for (const [side, value] of Object.entries(JSON.parse(pinned))) {
        assert.equal(manager.buttonContainer.style[side], value);
    }
});

test('document pointerup updates the temporary toolbar after selection and clamps its position', () => {
    const nodes = [new LGraphNode(), new LGraphNode()];
    const { manager, document, canvas, writes, flushFrames } = load(nodes);
    manager.init();
    manager.isPermanent = false;
    manager.hide();
    const initialWrites = writes.length;
    const release = target => document.dispatch('pointerup', {
        target, clientX: 30, clientY: 10,
        composedPath: () => [target, target.parentElement, document],
    });
    release(canvas.canvas);
    assert.equal(manager.isShow, false);
    flushFrames();
    assert.equal(manager.isShow, true);
    assert.equal(manager.buttonContainer.style.left, '0px');
    assert.equal(manager.buttonContainer.style.top, '0px');
    assert.equal(writes.length, initialWrites);
    canvas.selectedItems.clear();
    document.dispatch('pointerup', { composedPath: () => [manager.buttonContainer] });
    flushFrames();
    assert.equal(manager.isShow, true);
    release(canvas.canvas);
    flushFrames();
    assert.equal(manager.isShow, false);
    const overlay = canvas.canvas.parentElement.appendChild(new Element('div'));
    nodes.forEach(node => canvas.selectedItems.add(node));
    const sidebar = canvas.canvas.parentElement.appendChild(new Element('div'));
    const workflowTab = sidebar.appendChild(new Element('button'));
    release(workflowTab);
    flushFrames();
    assert.equal(manager.isShow, false);
    overlay.classList.add('lg-node');
    release(overlay.appendChild(new Element('textarea')));
    flushFrames();
    assert.equal(manager.isShow, true);
});

test('destroy removes the toolbar and active drag listeners', () => {
    const { manager, document } = load();
    manager.init();
    manager.buttonContainer.shadowRoot.querySelector('.divider').dispatch('mousedown');
    manager.destroy();
    assert.equal(document.listenerCount('mousemove'), 0);
    assert.equal(document.listenerCount('mouseup'), 0);
    assert.equal(document.listenerCount('pointerup'), 0);
    assert.equal(document.listenerCount('pointerdown'), 0);
    assert.equal(document.body.querySelectorAll('#alignment-buttons').length, 0);
    assert.equal(manager.isInitialized, false);
    manager.init();
    assert.equal(document.body.querySelectorAll('#alignment-buttons').length, 1);
    assert.equal(document.listenerCount('pointerup'), 1);
});

process.exitCode = failures ? 1 : 0;
console.log(`${checks - failures}/${checks} checks passed`);
