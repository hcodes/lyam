export function getRandom(): number {
    return Math.floor(Math.random() * (1 << 31 - 1));
}
