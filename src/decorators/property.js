export function property(options = {}) {
    return function (target, propertyName) {
        const constructor = target.constructor;

        if (!constructor._observedAttributes) {
            constructor._observedAttributes = [];
        }

        constructor._observedAttributes.push(propertyName);

        Object.defineProperty(target, propertyName, {
            get() {
                return this._props[propertyName];
            },
            set(value) {
                const oldValue = this._props[propertyName];
                this._props[propertyName] = value;

                if (options.reflect) {
                    const attrValue = typeof value === 'object' ?
                        JSON.stringify(value) : String(value);
                    this.setAttribute(propertyName, attrValue);
                }

                if (typeof this.propertyChanged === 'function' && oldValue !== value) {
                    this.propertyChanged(propertyName, oldValue, value);
                }
            },
            enumerable: true,
            configurable: true
        });
    };
}

export function readonly(target, propertyName, descriptor) {
    descriptor.writable = false;
    return descriptor;
}