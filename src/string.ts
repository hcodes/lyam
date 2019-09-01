export function truncate(str: string, len: number): string {
    return (str || '').slice(len);
}
