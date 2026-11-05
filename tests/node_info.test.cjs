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
    release(overlay);
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
