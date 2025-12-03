import { SimpleTemplateEngine } from './template-engine.js';

export class ElementXBase extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._props = {};
        this._state = {};
        this._refs = new Map();
        this._connected = false;

        this._templateEngine = new SimpleTemplateEngine();

        // 初始化属性
        this._initProps();
    }

    connectedCallback() {
        this._connected = true;
        this._render();

        if (typeof this.mounted === 'function') {
            setTimeout(() => this.mounted(), 0);
        }
    }

    disconnectedCallback() {
        this._connected = false;

        if (typeof this.unmounted === 'function') {
            this.unmounted();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // 更新 props
        if (this._props[name] !== undefined) {
            this._props[name] = this._parseAttrValue(newValue);
            this._render();
        }
    }

    _initProps() {
        // 从属性初始化 props
        Array.from(this.attributes).forEach(attr => {
            const value = this._parseAttrValue(attr.value);
            if (this._props[attr.name] === undefined) {
                this._props[attr.name] = value;
            }
        });
    }

    _parseAttrValue(value) {
        if (value === 'true' || value === 'false') {
            return value === 'true';
        }

        if (value === 'null') return null;
        if (value === 'undefined') return undefined;

        if (!isNaN(value) && value.trim() !== '') {
            const num = Number(value);
            if (!isNaN(num)) return num;
        }

        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    _render() {
        if (typeof this.render !== 'function') return;

        const template = this.render();
        if (typeof template === 'string') {
            const { content, refs, events } = this._templateEngine.render(template, this._props, this._state);

            this._shadow.innerHTML = '';
            this._shadow.appendChild(content);

            this._refs = refs;
            this._bindEvents(events);
        }
    }

    _bindEvents(events) {
        events.forEach(({ element, event, handler }) => {
            element.addEventListener(event, (e) => {
                if (typeof this[handler] === 'function') {
                    this[handler](e);
                }
            });
        });
    }

    update() {
        this._render();
    }

    setState(newState) {
        Object.assign(this._state, newState);
        if (this._connected) {
            this._render();
        }
    }

    // 辅助方法
    $(selector) {
        return this._refs.get(selector) || this._shadow.querySelector(selector);
    }

    $$(selector) {
        return Array.from(this._shadow.querySelectorAll(selector));
    }

    // 双向绑定
    bindTwoWay(prop, selector, event = 'input') {
        const element = this._refs.get(selector) || this._shadow.querySelector(selector);
        if (!element) return;

        // 从元素到属性
        element.addEventListener(event, (e) => {
            const value = e.target.value;
            this._props[prop] = value;

            // 触发更新
            if (this._connected) {
                this._render();
            }
        });

        // 从属性到元素（通过观察props变化）
        this._createPropObserver(prop, element);
    }

    _createPropObserver(prop, element) {
        let currentValue = this._props[prop];

        const updateElement = () => {
            if (this._props[prop] !== currentValue) {
                currentValue = this._props[prop];
                if (element.value !== undefined) {
                    element.value = currentValue;
                }
            }
        };

        // 每次渲染后检查
        const originalRender = this._render;
        this._render = function() {
            originalRender.call(this);
            updateElement();
        };
    }
}