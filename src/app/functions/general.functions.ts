export const createOrderedId = (start: string, end?: string) => {
    if (!start) start = '0';
    if (!end) end = '8';
    let found = false, pos = 0, s: number, e: number, prefix: string = '';
    while (!found) {
        s = parseInt(start.charAt(pos) || '0');
        e = parseInt(end.charAt(pos) || '8');
        if (e - s > 1) found = true; else { prefix += s.toString(); pos++ }
    }
    const getDigit = (start: number, end: number, first: number = 0, last: number = 8): number => {
        // Do not call if (end-start==1) else will cause a stack overflow
        let center = (first + last) / 2;
        if (center > start && center < end) return center;
        if (center >= end) return getDigit(start, end, first, center)
        if (center <= start) return getDigit(start, end, center, last)
        throw new Error('Invalid arguments');
    }
    return prefix + getDigit(s, e).toString()
}
