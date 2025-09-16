export function lowerCamelToSnake(str: string) {
    return str.replace(/[A-Z]/gu, c => `_${c.toLowerCase()}`);
}

export function snakeToLowerCamel(str: string) {
    return str.replace(/_(.)/gu, (_, c: string) => c.toUpperCase());
}
