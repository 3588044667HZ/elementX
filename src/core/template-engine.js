export class SimpleTemplateEngine {
    render(template, props, state) {
        // 创建容器
        const container = document.createElement('div');

        // 处理插值 {{prop}}
        let processed = template;
        processed = processed.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            const value = props[key.trim()] || state[key.trim()] || '';
            return value;
        });

        // 设置HTML
        container.innerHTML = processed;

        // 收集 refs
        const refs = new Map();
        container.querySelectorAll('[ref]').forEach(element => {
            const refName = element.getAttribute('ref');
            refs.set(refName, element);
            element.removeAttribute('ref');
        });

        // 收集事件
        const events = [];
        container.querySelectorAll('*').forEach(element => {
            Array.from(element.attributes).forEach(attr => {
                if (attr.name.startsWith('@')) {
                    const eventName = attr.name.substring(1);
                    const handler = attr.value;

                    events.push({
                        element,
                        event: eventName,
                        handler
                    });

                    element.removeAttribute(attr.name);
                }
            });
        });

        return {
            content: container.firstElementChild ? container.firstElementChild.cloneNode(true) : container,
            refs,
            events
        };
    }
}