function isEmpty(value) {
    // null, undefined
    if (value === null || value === undefined) {
        return true;
    }

    // 빈 문자열
    if (typeof value === "string") {
        return value === "";
    }

    // 배열
    if (Array.isArray(value)) {
        // 모든 요소 확인
        return value.every(isEmpty);
    }

    // 객체
    if (typeof value === "object") {
        // 모든 속성, 키 확인
        return Object.keys(value).length === 0 || Object.values(value).every(isEmpty);
    }

    // 원시 타입
    return false;
}

console.log(isEmpty(null)); // true
console.log(isEmpty({})); // true
console.log(isEmpty(0)); // false
console.log(isEmpty(false)); // false
console.log(isEmpty([{}, {a:[]}])) // true
console.log(isEmpty({a: null, b: ''})); // true
