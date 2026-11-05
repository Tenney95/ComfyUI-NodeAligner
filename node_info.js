import { app } from "../../scripts/app.js";

const alignBottomSvg = `<svg t="1725534360155" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1662" width="100%"><path d="M1170.285714 987.428571a36.571429 36.571429 0 0 0-36.571428-36.571428H36.571429a36.571429 36.571429 0 0 0 0 73.142857h1097.142857a36.571429 36.571429 0 0 0 36.571428-36.571429z m-219.428571-146.285714v-512a36.571429 36.571429 0 0 0-36.571429-36.571428h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571428v512a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z m-438.857143 0V36.571429a36.571429 36.571429 0 0 0-36.571429-36.571429h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571429v804.571428a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z" fill="#666666" p-id="1663"></path></svg>`;
const alignCenterHorizontallySvg = `<svg t="1725534379860" class="icon" viewBox="0 0 1243 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="100%"><path d="M548.571429 472.356571h146.285714V231.643429a36.571429 36.571429 0 0 1 36.571428-36.571429h219.428572a36.571429 36.571429 0 0 1 36.571428 36.571429v240.713142h179.785143a39.643429 39.643429 0 0 1 0 79.286858H987.428571v240.713142a36.571429 36.571429 0 0 1-36.571428 36.571429h-219.428572a36.571429 36.571429 0 0 1-36.571428-36.571429V551.643429h-146.285714V950.857143a36.571429 36.571429 0 0 1-36.571429 36.571428H292.571429a36.571429 36.571429 0 0 1-36.571429-36.571428V551.643429H76.214857a39.643429 39.643429 0 1 1 0-79.286858H256V73.142857A36.571429 36.571429 0 0 1 292.571429 36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571428v399.213714z" fill="#666666" p-id="2251"></path></svg>`;
const alignCenterVerticallySvg = `<svg t="1725534363707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1809" width="100%"><path d="M477.312 576V448H266.688a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h210.624V34.688a34.688 34.688 0 0 1 69.376 0V192h210.624a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v128H896a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v157.312a34.688 34.688 0 1 1-69.376 0V832H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 576h349.312z" fill="#666666" p-id="1810"></path></svg>`;
const alignLeftSvg = `<svg t="1725534370541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2103" width="100%"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m128 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m0 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-704a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z" fill="#666666" p-id="2104"></path></svg>`;
const alignRightSvg = `<svg t="1725534384109" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2397" width="100%"><path d="M928 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32z m-576 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m-256 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-192A32 32 0 0 1 96 576z" fill="#666666" p-id="2398"></path></svg>`;
const alignTopSvg = `<svg t="1725534367556" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1956" width="100%"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m-219.428571 146.285714v512a36.571429 36.571429 0 0 1-36.571429 36.571428h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571428v-512a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z m-438.857143 0v804.571428a36.571429 36.571429 0 0 1-36.571429 36.571429h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571429v-804.571428a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z" fill="#666666" p-id="1957"></path></svg>`;
const horizontalDistributionSvg = `<svg t="1725534354023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1515" width="100%"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m832 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32zM384 800v-576a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32z" fill="#666666" p-id="1516"></path></svg>`;
const verticalDistributionSvg = `<svg t="1725534350231" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1368" width="100%"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m0 950.857142a36.571429 36.571429 0 0 1-36.571428 36.571429H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571428zM256 365.714286h658.285714a36.571429 36.571429 0 0 1 36.571429 36.571428v219.428572a36.571429 36.571429 0 0 1-36.571429 36.571428h-658.285714a36.571429 36.571429 0 0 1-36.571429-36.571428v-219.428572a36.571429 36.571429 0 0 1 36.571429-36.571428z" fill="#666666" p-id="1369"></path></svg>`;
const equalWidthSvg = `<svg t="1725606034670" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="100%"><path d="M978.24 480a42.688 42.688 0 0 1-42.688 42.688H172.928a42.688 42.688 0 0 1-42.688-42.688V213.312c0-23.552 19.072-42.624 42.688-42.624h762.624c23.552 0 42.688 19.072 42.688 42.624V480z" fill="#666666" p-id="7214"></path><path d="M256.96 734.144c0-14.08 11.456-25.6 25.6-25.6h543.36a25.6 25.6 0 0 1 0 51.2h-543.36a25.6 25.6 0 0 1-25.6-25.6z" fill="#666666" p-id="7215"></path><path d="M136.64 745.216a12.8 12.8 0 0 1 0-22.144l184.192-106.368a12.8 12.8 0 0 1 19.2 11.072v212.736a12.8 12.8 0 0 1-19.2 11.072l-184.192-106.368zM971.84 745.216a12.8 12.8 0 0 0 0-22.144l-184.256-106.368a12.8 12.8 0 0 0-19.2 11.072v212.736a12.8 12.8 0 0 0 19.2 11.072l184.256-106.368z" fill="#666666" p-id="7216"></path></svg>`
const equalWidth2Svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="280" height="264" viewBox="0 0 280 264"><defs><clipPath id="master_svg0_395_0211"><rect x="0" y="0" width="280" height="264" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_395_0211)"><g><path d="M251.7527001953125,123.7499931640625C251.7527001953125,129.8281931640625,246.8347001953125,134.7554931640625,240.7667001953125,134.7554931640625L44.5036001953125,134.7554931640625C38.436250195312496,134.7554931640625,33.5177001953125,129.8281931640625,33.5177001953125,123.7499931640625L33.5177001953125,54.994493164062504C33.5177001953125,48.9224931640625,38.4259401953125,44.0054931640625,44.5036001953125,44.0054931640625L240.7667001953125,44.0054931640625C246.8287001953125,44.0054931640625,251.7527001953125,48.9224931640625,251.7527001953125,54.994493164062504L251.7527001953125,123.7499931640625Z" fill="#666666" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g><path d="M66,188.59999C66,184.96999,68.94823,182,72.58824,182L212.424,182C216.062,181.9999842644,219.012,184.95491,219.012,188.59999C219.012,192.2451,216.062,195.2,212.424,195.2L72.58824,195.2C68.94966,195.2,66.00000785379,192.2451,66,188.59999Z" fill="#666666" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g><path d="M33.67635708496094,219.00163010253905C32.344027084960935,219.76823010253906,30.681137084960938,218.80783010253907,30.681137084960938,217.27173010253907L30.681137084960938,159.53892010253907C30.681137084960938,158.00075510253907,32.34226708496094,157.03627810253906,33.67635708496094,157.79985010253907L83.97753708496094,186.58973010253905C85.31673708496093,187.35623010253906,85.31673708496093,189.28813010253907,83.97753708496094,190.05873010253907L33.67635708496094,219.00163010253905ZM246.32413708496094,157.99836010253907C247.65613708496093,157.23174310253907,249.31913708496094,158.19217710253906,249.31913708496094,159.72832010253907L249.31913708496094,217.46113010253907C249.31913708496094,218.99923010253906,247.65813708496094,219.96373010253905,246.32413708496094,219.20013010253905L196.02213708496095,190.41023010253906C194.68313708496095,189.64373010253905,194.68313708496095,187.71183010253907,196.02213708496095,186.94123010253907L246.32413708496094,157.99836010253907Z" fill="#666666" fill-opacity="1"/></g></g></svg>`
const equalHeightSvg = `<svg t="1725606224564" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7790" width="100%"><path d="M572.16 936a42.688 42.688 0 0 1-42.688-42.688V130.688c0-23.616 19.136-42.688 42.688-42.688h266.688c23.552 0 42.624 19.072 42.624 42.688v762.624a42.688 42.688 0 0 1-42.624 42.688H572.16z" fill="#666666" p-id="7791"></path><path d="M318.016 214.72c14.08 0 25.6 11.456 25.6 25.6v543.36a25.6 25.6 0 1 1-51.2 0v-543.36c0-14.144 11.456-25.6 25.6-25.6z" fill="#666666" p-id="7792"></path><path d="M306.944 94.4a12.8 12.8 0 0 1 22.144 0l106.368 184.192a12.8 12.8 0 0 1-11.072 19.2H211.648a12.8 12.8 0 0 1-11.072-19.2l106.368-184.192zM306.944 929.6a12.8 12.8 0 0 0 22.144 0l106.368-184.192a12.8 12.8 0 0 0-11.072-19.2H211.648a12.8 12.8 0 0 0-11.072 19.2l106.368 184.192z" fill="#666666" p-id="7793"></path></svg>`
const equalHeight2Svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="1088" height="1024" viewBox="0 0 1088 1024"><defs><clipPath id="master_svg0_395_0217"><rect x="0" y="0" width="1088" height="1024" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_395_0217)"><g><path d="M572.1599848632812,936C548.5840848632813,936,529.4719848632812,916.888,529.4719848632812,893.312L529.4719848632812,130.688C529.4719848632812,107.072,548.6079848632812,88,572.1599848632812,88L838.8479848632812,88C862.3999848632812,88,881.4719848632812,107.072,881.4719848632812,130.688L881.4719848632812,893.312C881.4719848632812,916.863,862.3989848632813,935.965,838.8479848632812,936L572.1599848632812,936Z" fill="#666666" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g><path d="M318.0159851074219,214.72000122070312C332.0959851074219,214.72000122070312,343.61598510742186,226.1760012207031,343.61598510742186,240.32000122070312L343.61598510742186,783.6800012207032C343.61598510742186,797.8190012207032,332.15448510742186,809.2800012207031,318.0159851074219,809.2800012207031C303.8774851074219,809.2800012207031,292.41595458982187,797.8190012207032,292.4159851074219,783.6800012207032L292.4159851074219,240.32000122070312C292.4159851074219,226.1760012207031,303.8719851074219,214.72000122070312,318.0159851074219,214.72000122070312Z" fill="#666666" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g transform="matrix(0,0.999941349029541,-0.999941349029541,0,526.9946627616882,-344.9744281768799)"><path d="M447.5076,327.211C442.38877,330.15700000000004,436,326.466,436,320.563L436,98.70931C436,92.79851,442.38203,89.09225,447.5076,92.02648L640.763,202.659C645.909,205.60500000000002,645.909,213.029,640.763,215.99L447.5076,327.211ZM1264.492,92.78931C1269.6109999999999,89.84338,1276,93.5341,1276,99.43713L1276,321.291C1276,327.201,1269.618,330.908,1264.492,327.974L1071.237,217.341C1066.091,214.39499999999998,1066.091,206.971,1071.237,204.01L1264.492,92.78931Z" fill="#666666" fill-opacity="1"/></g></g></svg>`

const ButtonManager = {
    isInitialized: false, // 检查是否已经初始化
    buttonContainer: null, // 保存按钮容器
    contextMenu: null, // 右键菜单
    isPermanent: true, // 是否为驻留按钮
    initialX: 0,  // 初始位置X
    initialY: 0,  // 初始位置Y
    dragStartX: 0, // 拖拽开始时的X
    dragStartY: 0, // 拖拽开始时的Y
    isDragging: false, // 检查是否正在拖拽
    hasShownTooltip: false, // 检查是否已经显示过提示
    isShow: true, // 是否显示按钮
    // 初始化按钮
    init() {
        if (this.isInitialized) return;

        this.boundOnDragStart = this.onDragStart.bind(this);
        this.boundOnDragging = this.onDragging.bind(this);
        this.boundOnDragEnd = this.onDragEnd.bind(this);
        this.boundOnSelectionChange = this.onSelectionChange.bind(this);
        this.boundOnDocumentPointerDown = (event) => {
            if (!event.composedPath().includes(this.buttonContainer)) {
                this.contextMenu.style.display = 'none';
            }
        };

        // Create button container
        this.buttonContainer = document.createElement('div');
        this.buttonContainer.id = 'alignment-buttons';

        // Create shadow root
        const shadow = this.buttonContainer.attachShadow({ mode: 'open' });

        // Create main wrapper to maintain structure
        const wrapper = document.createElement('div');
        wrapper.id = 'alignment-buttons-wrapper';
        wrapper.style.cssText = 'display: flex; width: 100%; height: 100%;';

        // Create style element for shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            #alignment-buttons {
                z-index: 999999999;
            }
            :host {
                position: fixed;
                top: 20px;
                right: 10px;
                left: unset;
                bottom: unset;
                display: block;
                background: #2b2b2b;
                padding: 4px;
                border-radius: 4px;
                z-index: 9999999999;
                width: 290px;
                height: 32px;
            }
            #alignment-buttons-wrapper {
                display: flex;
                white-space: nowrap;
            }
            .custom-button {
                width: 25px;
                height: 25px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-color: #2b2b2b;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }
            .custom-button:hover {
                background-color: #555555;
            }
            .divider {
                width: 3.2px;
                height: 15px;
                background-color: #1e1e1e;
                margin: 5px 4px;
                border-radius: 9px;
                cursor: grab; 
            }
            .divider:active {
                cursor: grabbing;
            }
            #tooltip {
                position: absolute;
                bottom: -20px;
                right: 0;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 6px;
                display: none;
                z-index: 1001;
                white-space: nowrap;
                font-size: 12px;
            }
            #context-menu {
                position: fixed;
                background: #2b2b2b;
                border-radius: 4px;
                padding: 5px;
                z-index: 10000;
                display: none;
            }
            #context-menu button {
                display: block;
                width: 100%;
                padding: 5px 10px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                text-align: left;
                border-radius: 4px;
                overflow: hidden;
            }
            #context-menu button:hover {
                background-color: #555555;
            }
            .custom-button svg {
                width: 100%;
                height: 100%;
            }
        `;

        // Append style and wrapper to shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        document.body.appendChild(this.buttonContainer);
        this.restorePosition();

        // Create buttons and assign functionality
        const buttons = this.getButtons();
        buttons.forEach(btn => {
            if (btn.type === 'divider') {
                const divider = document.createElement('div');
                divider.classList.add('divider');
                divider.addEventListener('mousedown', this.boundOnDragStart);
                wrapper.appendChild(divider);
            } else {
                const button = document.createElement('button');
                button.id = btn.id;
                button.type = 'button';
                button.title = btn.title;
                button.setAttribute('aria-label', btn.title);
                button.classList.add('custom-button');
                button.innerHTML = btn.svg;
                button.addEventListener('click', (event) => {
                    this.runAction(btn.action, event);
                    event.stopPropagation();
                });
                wrapper.appendChild(button);
            }
        });

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.textContent = '右键可选按钮呈现模式';
        wrapper.appendChild(tooltip);

        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'context-menu';
        contextMenu.innerHTML = `
            <button id="pin-mode">驻留</button>
            <button id="toggle-on-select">选中后显示</button>
        `;
        wrapper.appendChild(contextMenu);
        this.contextMenu = contextMenu;

        // Bind context menu events
        this.buttonContainer.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
        });

        // Click handlers for context menu
        contextMenu.querySelector('#pin-mode').addEventListener('click', () => {
            contextMenu.style.display = 'none';
            this.isPermanent = true;
            localStorage.setItem('NodeAlignerIsPermanent', '1');
            this.restorePosition();
            this.show();
        });

        contextMenu.querySelector('#toggle-on-select').addEventListener('click', () => {
            this.hide();
            contextMenu.style.display = 'none';
            this.isPermanent = false;
            localStorage.setItem('NodeAlignerIsPermanent', '0');
        });

        // Handle tooltip display
        if (!this.hasShownTooltip) {
            this.buttonContainer.addEventListener('mouseenter', () => {
                if (!this.hasShownTooltip) {
                    this.tooltipTimer = setTimeout(() => {
                        tooltip.style.display = 'block';
                        this.hasShownTooltip = true;
                    }, 1000);
                }
            });

            this.buttonContainer.addEventListener('mouseleave', () => {
                clearTimeout(this.tooltipTimer);
                tooltip.style.display = 'none';
            });
        }

        // Initialize visibility state
        let isPermanent = localStorage.getItem('NodeAlignerIsPermanent');
        if (isPermanent) {
            this.isPermanent = isPermanent === '1';
            this.isPermanent ? this.show() : this.hide();
        } else {
            this.show();
        }

        document.addEventListener('pointerup', this.boundOnSelectionChange, true);
        document.addEventListener('pointerdown', this.boundOnDocumentPointerDown, true);
        this.isInitialized = true;
    },

    // 获取按钮配置
    getButtons() {
        return [
            /* 左对齐 */
            { id: 'alignLeft', title: '左对齐（按列）/ 未选择时重置视图', svg: alignLeftSvg, action: this.alignLeft.bind(this) },
            /* 竖向居中对齐 */
            { id: 'alignCenterVertically', title: '水平居中（按列）', svg: alignCenterVerticallySvg, action: this.alignCenterVertically.bind(this) },
            /* 右对齐 */
            { id: 'alignRight', title: '右对齐（按列）', svg: alignRightSvg, action: this.alignRight.bind(this) },
            // 分割线
            { type: 'divider' },
            /* 顶部对齐 */
            { id: 'alignTop', title: '顶部对齐（按行）', svg: alignTopSvg, action: this.alignTop.bind(this) },
            /* 横向居中对齐 */
            { id: 'alignCenterHorizontally', title: '垂直居中（按行）', svg: alignCenterHorizontallySvg, action: this.alignCenterHorizontally.bind(this) },
            /* 底部对齐 */
            { id: 'alignBottom', title: '底部对齐（按行）', svg: alignBottomSvg, action: this.alignBottom.bind(this) },
            // 分割线
            { type: 'divider' },
            /* 横向分布 */
            { id: 'horizontalDistribution', title: '水平分布（按行）', svg: horizontalDistributionSvg, action: this.horizontalDistribution.bind(this) },
            /* 竖向分布 */
            { id: 'verticalDistribution', title: '垂直分布（按列）', svg: verticalDistributionSvg, action: this.verticalDistribution.bind(this) },
            // 分割线
            { type: 'divider' },
            /* 等宽 */
            { id: 'equalWidth', title: '等宽（最大值）', svg: equalWidthSvg, action: this.equalWidth.bind(this) },
            { id: 'equalMinWidth', title: '等宽（最小值）', svg: equalWidth2Svg, action: this.equalMinWidth.bind(this) },
            /* 等高 */
            { id: 'equalHeight', title: '等高（最大值）', svg: equalHeightSvg, action: this.equalHeight.bind(this) },
            { id: 'equalMinHeight', title: '等高（最小值）', svg: equalHeight2Svg, action: this.equalMinHeight.bind(this) },
        ];
    },
    // 显示按钮
    show() {
        this.isShow = true;
        this.buttonContainer.style.display = 'flex'; // 显示按钮容器
    },

    // 隐藏按钮
    hide() {
        this.isShow = false;
        this.buttonContainer.style.display = 'none'; // 隐藏按钮容器
    },
    setPosition(x, y) {
        const rect = this.buttonContainer.getBoundingClientRect();
        this.buttonContainer.style.right = 'unset';
        this.buttonContainer.style.bottom = 'unset';
        this.buttonContainer.style.left = `${Math.max(0, Math.min(x, window.innerWidth - rect.width))}px`;
        this.buttonContainer.style.top = `${Math.max(0, Math.min(y, window.innerHeight - rect.height))}px`;
    },
    onSelectionChange(event) {
        if (this.isPermanent || event.composedPath().includes(this.buttonContainer)) return;
        const canvas = app.canvas?.canvas;
        if (!canvas?.parentElement?.contains(event.target)) return;
        if (event.target !== canvas && !event.target.closest?.('.lg-node')) return;
        cancelAnimationFrame(this.selectionFrame);
        this.selectionFrame = requestAnimationFrame(() => {
            if (this.isPermanent) return;
            if (this.getSelectedNodes().length >= 2) {
                this.show();
                this.setPosition(event.clientX - 240, event.clientY - 20);
            } else {
                this.hide();
            }
        });
    },
    // 开始拖拽
    onDragStart(e) {
        if (e.button !== 0 || !e.target.classList.contains('divider') || this.isDragging) return;
        e.preventDefault();
        this.isDragging = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        const rect = this.buttonContainer.getBoundingClientRect();
        this.dragStartX = rect.left;
        this.dragStartY = rect.top;

        document.addEventListener('mousemove', this.boundOnDragging);
        document.addEventListener('mouseup', this.boundOnDragEnd);
    },
    // 拖拽中
    onDragging(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.initialX;
            const deltaY = e.clientY - this.initialY;

            this.setPosition(this.dragStartX + deltaX, this.dragStartY + deltaY);
        }
    },
    // 结束拖拽
    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        // 移除事件监听器
        document.removeEventListener('mousemove', this.boundOnDragging);
        document.removeEventListener('mouseup', this.boundOnDragEnd);
        if (!this.isPermanent) return;

        // 获取按钮容器的位置信息
        const rect = this.buttonContainer.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算距离四个边的距离
        const distanceToTop = rect.top;
        const distanceToBottom = windowHeight - rect.bottom;
        const distanceToLeft = rect.left;
        const distanceToRight = windowWidth - rect.right;

        // 选择两个最近的边
        let top = 'unset';
        let bottom = 'unset';
        let left = 'unset';
        let right = 'unset';

        if (distanceToTop < distanceToBottom) {
            top = `${distanceToTop}px`;
        } else {
            bottom = `${distanceToBottom}px`;
        }

        if (distanceToLeft < distanceToRight) {
            left = `${distanceToLeft}px`;
        } else {
            right = `${distanceToRight}px`;
        }

        // 更新样式使其根据距离四边的情况固定
        this.buttonContainer.style.top = top;
        this.buttonContainer.style.bottom = bottom;
        this.buttonContainer.style.left = left;
        this.buttonContainer.style.right = right;

        // 保存位置到 localStorage
        localStorage.setItem('NodeAlignerButtonContainerPosition', JSON.stringify({ top, left, right, bottom }));
    },
    destroy() {
        document.removeEventListener('mousemove', this.boundOnDragging);
        document.removeEventListener('mouseup', this.boundOnDragEnd);
        document.removeEventListener('pointerup', this.boundOnSelectionChange, true);
        document.removeEventListener('pointerdown', this.boundOnDocumentPointerDown, true);
        cancelAnimationFrame(this.selectionFrame);
        clearTimeout(this.tooltipTimer);
        this.buttonContainer?.remove();
        this.buttonContainer = null;
        this.contextMenu = null;
        this.isDragging = false;
        this.isInitialized = false;
    },
    // 恢复位置
    restorePosition() {
        try {
            const savedPosition = JSON.parse(localStorage.getItem('NodeAlignerButtonContainerPosition'));
            if (savedPosition && typeof savedPosition === 'object') {
                this.buttonContainer.style.top = savedPosition.top || '20px';
                this.buttonContainer.style.bottom = savedPosition.bottom || 'unset';
                this.buttonContainer.style.left = savedPosition.left || 'unset';
                this.buttonContainer.style.right = savedPosition.right || '20px';
            } else {
                this.setDefaultPosition();
            }
        } catch (e) {
            console.warn('Failed to parse saved position:', e);
            this.setDefaultPosition();
        }

        // ===== 在这里检测是否超出屏幕边界 =====
        const containerRect = this.buttonContainer.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (
            containerRect.left < 0 ||
            containerRect.top < 0 ||
            containerRect.right > windowWidth ||
            containerRect.bottom > windowHeight
        ) {
            console.log('NodeAligner位置已超出屏幕范围，重置为默认位置');
            // 调用setDefaultPosition重置位置
            this.setDefaultPosition();

            // 保存默认位置到 localStorage，确保下次进入不会越界
            localStorage.setItem('NodeAlignerButtonContainerPosition', JSON.stringify({
                top: this.buttonContainer.style.top,
                left: this.buttonContainer.style.left,
                right: this.buttonContainer.style.right,
                bottom: this.buttonContainer.style.bottom
            }));
        }
    },
    setDefaultPosition() {
        this.buttonContainer.style.top = '20px';
        this.buttonContainer.style.right = '20px';
        this.buttonContainer.style.bottom = 'unset';
        this.buttonContainer.style.left = 'unset';
    },
    // 获取当前选中的节点
    getSelectedNodes() {
        const canvas = app.canvas;
        if (!canvas) return [];
        if (canvas.selectedItems) {
            return [...canvas.selectedItems].filter(item => item instanceof window.LGraphNode);
        }
        return Object.values(canvas.selected_nodes || {});
    },
    runAction(action, event) {
        const canvas = app.canvas;
        if (!canvas) return;
        const graph = canvas.graph;
        const changesNodes = this.getSelectedNodes().length > 0;
        if (changesNodes) {
            if (!graph) return;
            graph.beforeChange();
            canvas.emitBeforeChange?.();
        }
        try {
            action.call(this, event);
        } finally {
            if (changesNodes) {
                graph.afterChange();
                canvas.emitAfterChange?.();
            }
            canvas.setDirty(true, true);
        }
    },
    // Nodes 2.0 的控件最小尺寸可能大于工作流里保存的 size。
    getNodeSize(node, axis) {
        return (node.renderingSize ?? node.size)[axis];
    },
    compareNodes(a, b, axis) {
        return a.pos[axis] - b.pos[axis]
            || a.pos[1 - axis] - b.pos[1 - axis]
            || String(a.id).localeCompare(String(b.id));
    },
    median(values) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    },
    getTrackTolerance(nodes, axis) {
        return this.median(nodes.map(node => this.getNodeSize(node, axis))) / 4;
    },
    getReferenceNode(group, axis) {
        return group.reduce((first, node) => this.compareNodes(node, first, axis) < 0 ? node : first);
    },
    // 同一行/列保留共同的投影区间，避免通过相邻节点链式合并。
    getOverlappingGroups(nodes, axis) {
        const groups = [];
        const maximumSpan = this.getTrackTolerance(nodes, axis) * 4;
        let commonEnd = -Infinity;
        for (const node of [...nodes].sort((a, b) => this.compareNodes(a, b, axis))) {
            const group = groups[groups.length - 1];
            const start = node.pos[axis];
            const end = start + this.getNodeSize(node, axis);
            if (group && start < commonEnd && start - group[0].pos[axis] <= maximumSpan) {
                group.push(node);
                commonEnd = Math.min(commonEnd, end);
            } else {
                groups.push([node]);
                commonEnd = end;
            }
        }
        return groups;
    },
    // 矮节点错位后投影可能不重叠，明显的行/列间断层仍能提供分层证据。
    getGapGroups(nodes, axis) {
        const sorted = [...nodes].sort((a, b) => this.compareNodes(a, b, axis));
        const gaps = sorted.slice(1).map((node, index) => node.pos[axis] - sorted[index].pos[axis])
            .filter(gap => gap > 0);
        const typicalGap = this.median(gaps);
        if (!typicalGap || Math.max(...gaps) <= typicalGap * 2) return [];
        const groups = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i === 0 || sorted[i].pos[axis] - sorted[i - 1].pos[axis] > typicalGap * 1.5) {
                groups.push([sorted[i]]);
            } else {
                groups[groups.length - 1].push(sorted[i]);
            }
        }
        return groups;
    },
    // 跨行/列做有序匹配；允许缺格和新增列，不把短行向左压缩。
    matchGridTracks(groups, axis, nodes) {
        const seed = groups.reduce((longest, group) => group.length > longest.length ? group : longest);
        let tracks = [...seed].sort((a, b) => this.compareNodes(a, b, axis)).map(node => [node]);
        const typicalSize = this.getTrackTolerance(nodes, axis) * 4;
        const gapCost = 0.5;
        for (const group of groups) {
            if (group === seed) continue;
            const ordered = [...group].sort((a, b) => this.compareNodes(a, b, axis));
            const references = tracks.map(track => this.getReferenceNode(track, 1 - axis));
            const gaps = references.slice(1).map((node, index) => node.pos[axis] - references[index].pos[axis])
                .filter(gap => gap > 0);
            const scale = Math.max(1, typicalSize, this.median(gaps));
            const path = Array.from({ length: tracks.length + 1 }, () => new Uint8Array(ordered.length + 1));
            let previous = Float64Array.from({ length: ordered.length + 1 }, (_, index) => index * gapCost);
            let current = new Float64Array(ordered.length + 1);
            for (let j = 1; j <= ordered.length; j++) path[0][j] = 3;
            for (let i = 1; i <= tracks.length; i++) {
                current[0] = i * gapCost;
                path[i][0] = 2;
                for (let j = 1; j <= ordered.length; j++) {
                    const match = previous[j - 1]
                        + Math.abs(references[i - 1].pos[axis] - ordered[j - 1].pos[axis]) / scale;
                    const missing = previous[j] + gapCost;
                    const inserted = current[j - 1] + gapCost;
                    if (match <= missing && match <= inserted) {
                        current[j] = match;
                        path[i][j] = 1;
                    } else if (missing <= inserted) {
                        current[j] = missing;
                        path[i][j] = 2;
                    } else {
                        current[j] = inserted;
                        path[i][j] = 3;
                    }
                }
                [previous, current] = [current, previous];
            }
            const matched = [];
            let i = tracks.length;
            let j = ordered.length;
            while (i || j) {
                const direction = path[i][j];
                if (direction === 1) matched.push([...tracks[--i], ordered[--j]]);
                else if (direction === 2) matched.push(tracks[--i]);
                else matched.push([ordered[--j]]);
            }
            tracks = matched.reverse();
        }
        return tracks;
    },
    getNodeGrid(nodes) {
        if (nodes.length < 4) return null;
        let best = null;
        let bestCount = 0;
        let bestSpread = Infinity;
        for (const axis of [1, 0]) {
            const crossTolerance = this.getTrackTolerance(nodes, 1 - axis);
            const scale = Math.max(1, this.getTrackTolerance(nodes, axis) * 4);
            for (const groups of [this.getNodeGroups(nodes, axis), this.getOverlappingGroups(nodes, axis),
                this.getGapGroups(nodes, axis)]) {
                const repeated = groups.filter(group => group.length > 1
                    && Math.max(...group.map(node => node.pos[1 - axis]))
                        - Math.min(...group.map(node => node.pos[1 - axis])) > crossTolerance);
                if (repeated.length < 2) continue;
                const count = repeated.reduce((sum, group) => sum + group.length, 0);
                const spread = repeated.reduce((sum, group) => sum + Math.min(...[0, 0.5, 1].map(anchor => {
                    const coordinates = group.map(node => node.pos[axis] + this.getNodeSize(node, axis) * anchor);
                    return Math.max(...coordinates) - Math.min(...coordinates);
                })) / scale, 0);
                if (count > bestCount || (count === bestCount && spread < bestSpread)) {
                    best = { axis, groups };
                    bestCount = count;
                    bestSpread = spread;
                }
            }
        }
        if (!best) return null;
        const matched = this.matchGridTracks(best.groups, 1 - best.axis, nodes);
        return best.axis === 1 ? { rows: best.groups, columns: matched } : { rows: matched, columns: best.groups };
    },
    // 用起点、中心或终点识别已经成形的行列，避免节点宽高不同造成拆组。
    getNodeGroups(nodes, axis, preferredAnchor = 0) {
        if (nodes.length < 2) return [nodes];
        const tolerance = this.getTrackTolerance(nodes, axis);
        let bestGroups = null;
        let bestCount = 0;
        let bestTrackCount = Infinity;
        let bestSpread = Infinity;
        let exactGroups = null;

        for (const anchor of new Set([preferredAnchor, 0, 0.5, 1])) {
            const coordinate = node => node.pos[axis] + this.getNodeSize(node, axis) * anchor;
            const sorted = [...nodes].sort((a, b) => coordinate(a) - coordinate(b)
                || this.compareNodes(a, b, 1 - axis));
            for (const threshold of [1e-6, tolerance]) {
                const groups = [];
                for (const node of sorted) {
                    const group = groups[groups.length - 1];
                    // 限制整组跨度，不让相邻节点通过链式合并串成一组。
                    if (group && coordinate(node) - coordinate(group[0]) <= threshold) {
                        group.push(node);
                    } else {
                        groups.push([node]);
                    }
                }
                const repeated = groups.filter(group => group.length > 1);
                const count = repeated.reduce((sum, group) => sum + group.length, 0);
                const spread = repeated.reduce((sum, group) => sum
                    + coordinate(group[group.length - 1]) - coordinate(group[0]), 0);
                // 完整的共同边线优先，防止再次点击时把相近但已对齐的列合并。
                if (threshold === 1e-6 && count === nodes.length
                    && (!exactGroups || repeated.length < exactGroups.length)) exactGroups = groups;
                if (threshold === tolerance && (count > bestCount || (count === bestCount
                    && (repeated.length < bestTrackCount
                        || (repeated.length === bestTrackCount && spread < bestSpread))))) {
                    bestGroups = groups;
                    bestCount = count;
                    bestTrackCount = repeated.length;
                    bestSpread = spread;
                }
            }
        }
        // 只有一条成形轨道时，将偏移的孤立节点一起整理（例如三齐一歪）。
        return bestTrackCount >= 2 && bestGroups ? (exactGroups ?? bestGroups) : [nodes];
    },
    alignNodes(axis, anchor) {
        const nodes = this.getSelectedNodes();
        if (nodes.length === 0) return;
        const grid = this.getNodeGrid(nodes);
        const groups = grid ? (axis === 0 ? grid.columns : grid.rows) : this.getNodeGroups(nodes, axis, anchor);
        for (const group of groups) {
            const minimum = Math.min(...group.map(node => node.pos[axis]));
            const maximum = Math.max(...group.map(node => node.pos[axis] + this.getNodeSize(node, axis)));
            const target = grid && anchor === 0
                ? this.getReferenceNode(group, 1 - axis).pos[axis]
                : minimum + (maximum - minimum) * anchor;
            group.forEach(node => {
                node.pos[axis] = target - this.getNodeSize(node, axis) * anchor;
            });
        }
    },
    // 左对齐；未选择节点时恢复预设视图。
    alignLeft() {
        if (this.getSelectedNodes().length === 0) {
            const canvas = app.canvas;
            if (canvas) {
                canvas.ds.offset = [80, 140];
                canvas.ds.scale = 1;
            }
        } else {
            this.alignNodes(0, 0);
        }
    },
    alignRight() {
        this.alignNodes(0, 1);
    },
    alignTop() {
        this.alignNodes(1, 0);
    },
    alignBottom() {
        this.alignNodes(1, 1);
    },
    alignCenterHorizontally() {
        this.alignNodes(1, 0.5);
    },
    alignCenterVertically() {
        this.alignNodes(0, 0.5);
    },
    distributeNodes(axis) {
        const nodes = this.getSelectedNodes();
        const grid = this.getNodeGrid(nodes);
        const groups = grid ? (axis === 0 ? grid.rows : grid.columns) : this.getNodeGroups(nodes, 1 - axis);
        for (const group of groups) {
            if (group.length < 2) continue;
            group.sort((a, b) => this.compareNodes(a, b, axis));
            const start = group[0].pos[axis];
            const end = Math.max(...group.map(node => node.pos[axis] + this.getNodeSize(node, axis)));
            const totalSize = group.reduce((sum, node) => sum + this.getNodeSize(node, axis), 0);
            const spacing = Math.max(20, (end - start - totalSize) / (group.length - 1));
            let current = start;
            group.forEach(node => {
                node.pos[axis] = current;
                current += this.getNodeSize(node, axis) + spacing;
            });
        }
    },
    horizontalDistribution() {
        this.distributeNodes(0);
    },
    verticalDistribution() {
        this.distributeNodes(1);
    },
    // 等宽 对齐最大值
    equalWidth() {
        this.equalSize(0);
    },
    // 等宽 对齐最小值
    equalMinWidth() {
        this.equalSize(0, Math.min);
    },

    // 等高
    equalHeight() {
        this.equalSize(1);
    },// 等高 对齐最小值
    equalMinHeight() {
        this.equalSize(1, Math.min);
    },


    // 通用的节点尺寸调整
    equalSize(axis, comparator = Math.max) {
        const nodes = this.getSelectedNodes();
        if (nodes.length > 0) {
            // 使用传入的比较函数（默认为 Math.max）
            const sizeValues = nodes.map(node => node.size[axis]);
            const targetSize = comparator(...sizeValues);

            // 将尺寸调整为最近的5的倍数
            const roundedTargetSize = Math.round(targetSize / 5) * 5;

            nodes.forEach(node => {
                const size = [...node.size];
                size[axis] = roundedTargetSize;
                node.setSize(size);
            });
        }
    }
};

app.registerExtension({
    name: "Comfy.NodeAligner",
    setup() {
        ButtonManager.init();
    }
});
