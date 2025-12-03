import { ElementXBase } from '../core/ElementXBase.js';

export class Paragraph extends ElementXBase {
    static get observedAttributes() {
        return ['data'];
    }

    constructor() {
        super();
        this._props = this._props || {};
        this._props.data = "";
    }

    // Getter 和 Setter
    get data() {
        return this._props?.data || '';
    }

    set data(value) {
        const oldValue = this._props?.data;
        this._props = this._props || {};
        this._props.data = value;

        // 设置属性
        if (value) {
            this.setAttribute('data', value);
        } else {
            this.removeAttribute('data');
        }

        // 触发更新
        if (this._connected) {
            this.update();
        }

        // 属性变化回调
        if (typeof this.propertyChanged === 'function' && oldValue !== value) {
            this.propertyChanged('data', oldValue, value);
        }
    }

    render() {
        return `
            <div class="paragraph">${this.data || ''}</div>
            <style>
                .paragraph {
                    display: block;
                    font-size: 20px;
                    color: aqua;
                    margin: 10px 0;
                    padding: 10px;
                    background: #f0f8ff;
                    border-radius: 4px;
                    min-height: 30px;
                }
            </style>
        `;
    }

    propertyChanged(name, oldValue, newValue) {
        console.log(`段落属性 ${name} 变化: ${oldValue} -> ${newValue}`);
    }

    mounted() {
        console.log('段落组件已加载，初始数据:', this.data);
    }
}

customElements.define('elx-paragraph', Paragraph);