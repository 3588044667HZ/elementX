// 解析属性值
export function parseValue(value) {
    if (value === 'true' || value === 'false') {
        return value === 'true';
    }

    if (value === 'null') return null;
    if (value === 'undefined') return undefined;

    // 尝试解析数字
    if (!isNaN(value) && value.trim() !== '') {
        const num = Number(value);
        if (!isNaN(num)) return num;
    }

    // 尝试解析JSON
    try {
        return JSON.parse(value);
    } catch (e) {
        // 如果不是JSON，返回原始字符串
        return value;
    }
}

// 序列化值
export function stringifyValue(value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

// 深拷贝
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
    return obj;
}

// 合并对象
export function merge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}