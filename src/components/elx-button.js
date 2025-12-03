import {ElementXBase} from '../core/index.js';
import {property} from '../decorators/property.js';
import {event} from '../decorators/event.js';

export class ElxButton extends ElementXBase {
    constructor() {
        super();
        this.type = 'button';
        this.variant = 'primary';
        this.disabled = false;
        this.loading = false;
    }

    render() {
        return `
            <button 
                ref="button"
                type="${this.type}"
                class="btn btn-${this.variant} ${this.loading ? 'loading' : ''}"
                ?disabled="${this.disabled || this.loading}"
                @click="handleClick"
            >
                ${this.loading ? 'Loading...' : '<slot></slot>'}
            </button>
            
            <style>
                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .btn-primary {
                    background-color: #007bff;
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: #0056b3;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .loading {
                    position: relative;
                    color: transparent;
                }
                
                .loading::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 16px;
                    height: 16px;
                    margin: -8px 0 0 -8px;
                    border: 2px solid #fff;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    handleClick(event) {
        if (this.disabled || this.loading) {
            event.preventDefault();
            return;
        }

        const customEvent = new CustomEvent('button-click', {
            detail: {element: this},
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(customEvent);
    }

    mounted() {
        console.log('Button component mounted');
    }
}

// 应用属性装饰器
property({reflect: true})(ElxButton.prototype, 'type');
property({reflect: true})(ElxButton.prototype, 'variant');
property({reflect: true})(ElxButton.prototype, 'disabled');
property({reflect: true})(ElxButton.prototype, 'loading');

// 应用事件装饰器
event('button-click')(ElxButton.prototype, 'handleClick',
    Object.getOwnPropertyDescriptor(ElxButton.prototype, 'handleClick')
);

customElements.define('elx-button', ElxButton);