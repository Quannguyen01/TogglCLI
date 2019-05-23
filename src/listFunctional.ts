export function arrayZipWith(func: any, a: any, b: any) {
    const result = [];
    for (let idx = 0; idx < min(a.length, b.length); idx++) {
        result.push(func.call(null, a[idx], b[idx]));
    }
    return result;
}

function min(a: any, b: any) {
    return a < b ? a : b;
}
