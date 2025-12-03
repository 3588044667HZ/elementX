export class ElementXObserver {
    constructor() {
        this.watchers = new Map();
        this.effects = new Set();
    }

    watch(getter, callback, immediate = false) {
        let oldValue = getter();

        if (immediate) {
            callback(oldValue);
        }

        const watcher = () => {
            const newValue = getter();
            if (newValue !== oldValue) {
                callback(newValue, oldValue);
                oldValue = newValue;
            }
        };

        const id = Symbol('watcher');
        this.watchers.set(id, watcher);

        return () => this.watchers.delete(id);
    }

    effect(callback) {
        this.effects.add(callback);
        callback();

        return () => this.effects.delete(callback);
    }

    notify() {
        // 执行所有watcher
        this.watchers.forEach(watcher => watcher());

        // 执行所有effects
        this.effects.forEach(effect => effect());
    }

    cleanup() {
        this.watchers.clear();
        this.effects.clear();
    }
}