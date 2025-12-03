import { ElementXBase } from '../core/ElementXBase.js';

export class ElxInput extends ElementXBase {
    static get observedAttributes() {
        return ['value', 'type', 'placeholder', 'disabled', 'required'];
    }

    constructor() {
        super();
        this._props = this._props || {};
        this._props.value = '';
        this._props.type = 'text';
        this._props.placeholder = '';
        this._props.disabled = false;
        this._props.required = false;
    }

    get value() {
        return this._props?.value || '';
    }

    set value(newValue) {
        const oldValue = this._props?.value;
        this._props = this._props || {};
        this._props.value = newValue;

        this.setAttribute('value', newValue);

        const inputElement = this.$('input');
        if (inputElement && inputElement.value !== newValue) {
            inputElement.value = newValue;
        }

        if (typeof this.propertyChanged === 'function' && oldValue !== newValue) {
            this.propertyChanged('value', oldValue, newValue);
        }

        if (this._connected) {
            this.update();
        }
    }

    render() {
        return `
            <div class="input-container">
                <input
                    ref="input"
                    type="${this.type}"
                    value="${this.value}"
                    placeholder="${this.placeholder}"
                    ${this.disabled ? 'disabled' : ''}
                    ${this.required ? 'required' : ''}
                />
            </div>
            
            <style>
                .input-container {
                    display: inline-block;
                }
                
                input {
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 200px;
                    box-sizing: border-box;
                }
            </style>
        `;
    }

    mounted() {
        console.log('ElxInput mounted');

        const inputElement = this.$('input');
        if (!inputElement) return;

        // 监听输入事件
        inputElement.addEventListener('input', (e) => {
            console.log('Input event:', {
                data: e.data,                    // 当前输入的字符
                inputType: e.inputType,          // 输入类型（insertText, deleteContentBackward等）
                targetValue: e.target.value,     // 完整的输入框值
                dataTransfer: e.dataTransfer,    // 数据传输（如粘贴）
                isComposing: e.isComposing       // 是否在组合输入（如中文输入法）
            });

            // 更新组件值（使用完整的输入框值）
            this.value = e.target.value;

            // 派发自定义事件，传递完整信息
            this.dispatchEvent(new CustomEvent('input', {
                detail: {
                    value: e.target.value,      // 完整的值
                    data: e.data,               // 当前输入的字符
                    inputType: e.inputType,     // 操作类型
                    element: this               // 组件实例
                },
                bubbles: true,
                composed: true
            }));
        });

        // 监听其他事件
        inputElement.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        });

        // 初始值同步
        inputElement.value = this.value;
    }

    propertyChanged(name, oldValue, newValue) {
        if (name === 'value') {
            console.log('Value changed:', oldValue, '->', newValue);
        }
    }
}

customElements.define('elx-input', ElxInput);