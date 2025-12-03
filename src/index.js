// 导出核心类
export {ElementXBase} from './core/ElementXBase.js';

// 导出装饰器
export {property, readonly} from './decorators/property.js';
export {event} from './decorators/event.js';

// 导出组件
export {ElxButton} from './components/elx-button.js';
export {ElxInput} from './components/elx-input.js';

// 如果要在浏览器中自动使用，可以添加自动注册
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
    console.log('elementX library loaded');
}