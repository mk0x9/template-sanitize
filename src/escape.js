const zeroPad = string => {
    while (string.length < 4) {
        string = '0' + string;
    }

    return string;
};

export const escape = (string, replacementTable) => {
    console.log(string);
    console.log(replacementTable);
    let result = '';

    for (let idx = 0; idx < string.length; idx++) {
        const current = string[idx];
        const currentCode = current.charCodeAt(0);

        if (current in replacementTable) {
            result += replacementTable[current];
        } else if ((0xfdd0 <= currentCode && currentCode <= 0xfdef) ||
                   (0xfff0 <= currentCode && currentCode <= 0xffff)) {
            result += '#' + zeroPad(currentCode.toString(16)) + ';';
        } else {
            result += current;
        }
    }

    return result;
};
