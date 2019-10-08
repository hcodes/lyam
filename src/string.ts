export function truncate(str: string, len: number): string {
    return (str || '').slice(0, len);
}
