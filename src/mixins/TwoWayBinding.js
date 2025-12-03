export const TwoWayBinding = (BaseClass = HTMLElement) => {
    return class extends BaseClass {
        constructor() {
            super();
            this._twoWayBindings = new Map();
        }

        // 建立双向绑定
        setupTwoWayBinding(prop, targetSelector, options = {}) {
            const {
                event = 'input',
                attribute = 'value',
                parse = v => v,
                format = v => v
            } = options;

            const element = this.shadowRoot.querySelector(targetSelector);
            if (!element) return;

            // 元素 -> 属性
            element.addEventListener(event, (e) => {
                const value = parse(e.target[attribute]);
                if (this[prop] !== value) {
                    this[prop] = value;
                }
            });

            // 属性 -> 元素
            const updateElement = () => {
                const value = format(this[prop]);
                if (element[attribute] !== value) {
                    element[attribute] = value;
                }
            };

            // 初始更新
            updateElement();

            // 监听属性变化
            this._twoWayBindings.set(prop, updateElement);

            // 返回清理函数
            return () => {
                this._twoWayBindings.delete(prop);
            };
        }

        // 更新所有绑定
        updateBindings() {
            this._twoWayBindings.forEach(update => update());
        }
    };
};