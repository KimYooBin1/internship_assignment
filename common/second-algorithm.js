function isEmpty(value, root = true) {
    let result = false;
    // null, undefined
    if (value === null || value === undefined) {
        result = true;
    }

    // 빈 문자열
    else if (typeof value === "string") {
        result = value === "";
    }

    // 배열
    else if (Array.isArray(value)) {
        // 모든 요소 확인
        result = value.every(v => isEmpty(v, false));
    }

    // 객체
    else if (typeof value === "object") {
        // 모든 속성, 키 확인
        result = Object.keys(value).length === 0 || Object.values(value).every(v => isEmpty(v, false));
    }
    // root를 사용해서 재귀가 발생한 경우에는 출력하지 않는다
    if(root){
        console.log(result);
    }
    return result;
}

isEmpty(null); // true
isEmpty({}); // true
isEmpty(0); // false
isEmpty(false); // false
isEmpty([{}, {a:[]}]) // true
isEmpty({a: null, b: ''}); // true
