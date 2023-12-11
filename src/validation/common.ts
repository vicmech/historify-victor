export function isOneOf<T>(obj: T, ...options: T[]): boolean {
    return options.some(opt => obj === opt);
}