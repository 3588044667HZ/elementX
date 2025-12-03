export function event(eventName) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const result = originalMethod.apply(this, args);

            const event = new CustomEvent(eventName || propertyName, {
                detail: args[0],
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(event);

            return result;
        };

        return descriptor;
    };
}