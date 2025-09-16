import {
    lowerCamelToSnake, snakeToLowerCamel
} from './string';

export function hasTrueRecord<T extends number | string | symbol>(map: Record<T, boolean>) {
    return Object.values(map).some(v => v);
}

export function lowerCamelKeyToSnakeKey<T extends Record<string, unknown>>(map: Record<string, unknown>): T {
    const result: Record<string, unknown> = {};
    for(const key in map) {
        if(Object.hasOwn(map, key)) {
            result[lowerCamelToSnake(key)] = map[key];
        }
    }
    return result as T;
}

export function snakeKeyToLowerCamelKey<T extends Record<string, unknown>>(map: Record<string, unknown>): T {
    const result: Record<string, unknown> = {};
    for(const key in map) {
        if(Object.hasOwn(map, key)) {
            result[snakeToLowerCamel(key)] = map[key];
        }
    }
    return result as T;
}
