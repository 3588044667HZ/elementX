class SimpleInput extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled', 'type'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // 创建内部 input 元素
        this._input = document.createElement('input');

        // 应用初始属性
        this._applyAttributes();

        // 监听输入事件
        this._input.addEventListener('input', (e) => {
            // 更新组件属性
            this.value = e.target.value;

            // 派发自定义事件，确保传递正确的值
            this.dispatchEvent(new CustomEvent('input', {
                detail: {
                    value: this.value,  // 使用组件的值，确保是字符串
                    data: e.data,
                    inputType: e.inputType,
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            }));

            // 同时派发一个 value-change 事件用于调试
            this.dispatchEvent(new CustomEvent('value-change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        });

        // 监听 change 事件
        this._input.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        });

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            input {
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                width: 250px;
                box-sizing: border-box;
                transition: border-color 0.3s;
            }
            
            input:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            }
            
            input:disabled {
                background-color: #f5f5f5;
                cursor: not-allowed;
            }
        `;

        this.shadowRoot.append(style, this._input);

        // 初始化值
        this._currentValue = '';
    }

    get value() {
        return this._input.value;
    }

    set value(newValue) {
        // 确保值是字符串
        const stringValue = String(newValue || '');

        // 只在实际变化时更新
        if (this._input.value !== stringValue) {
            this._input.value = stringValue;
            this._currentValue = stringValue;

            // 设置属性
            if (stringValue) {
                this.setAttribute('value', stringValue);
            } else {
                this.removeAttribute('value');
            }

            // 派发值变化事件
            if (this._currentValue !== stringValue) {
                this.dispatchEvent(new Event('valuechange', { bubbles: true }));
            }
        }
    }

    get placeholder() {
        return this._input.placeholder;
    }

    set placeholder(value) {
        this._input.placeholder = value || '';
        if (value) {
            this.setAttribute('placeholder', value);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    get disabled() {
        return this._input.disabled;
    }

    set disabled(value) {
        this._input.disabled = !!value;
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get type() {
        return this._input.type;
    }

    set type(value) {
        this._input.type = value || 'text';
        if (value) {
            this.setAttribute('type', value);
        } else {
            this.removeAttribute('type');
        }
    }

    // 应用属性到内部 input
    _applyAttributes() {
        const attributes = ['value', 'placeholder', 'type'];

        attributes.forEach(attr => {
            const value = this.getAttribute(attr);
            if (value !== null) {
                this._input[attr] = value;
            }
        });

        // 处理布尔属性
        if (this.hasAttribute('disabled')) {
            this._input.disabled = true;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'value':
                this.value = newValue;
                break;
            case 'placeholder':
                this.placeholder = newValue;
                break;
            case 'type':
                this.type = newValue;
                break;
            case 'disabled':
                this.disabled = newValue !== null;
                break;
        }
    }

    connectedCallback() {
        console.log('SimpleInput connected, value:', this.value);
        this._currentValue = this.value;
    }

    // 方便的方法
    focus() {
        this._input.focus();
    }

    blur() {
        this._input.blur();
    }

    select() {
        this._input.select();
    }

    // 获取当前值
    getCurrentValue() {
        return this.value;
    }
}

customElements.define('simple-input', SimpleInput);