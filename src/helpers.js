import { HTMLStateTypes, escapingContextTypes } from './enums';

export const isWhitespace = c => {
    const charCode = c.charCodeAt(0);

    return c === ' ' || // U+0020
        c === '\t' ||   // U+0009
        c === '\n' ||   // U+000a
        c === '\f';     // U+000c
};

export const isASCII = c => {
    const charCode = c.charCodeAt(0);

    return (65 <= charCode && charCode <= 90) ||
        (97 <= charCode && charCode <= 122);
};

export const HTMLStateToEscapingContext = HTMLState => {
    switch (HTMLState) {
    case HTMLStateTypes.data:
        return escapingContextTypes.HTML;

    case HTMLStateTypes.beforeAttrName:
    case HTMLStateTypes.attrName:
        return escapingContextTypes.HTMLAttr;

    case HTMLStateTypes.beforeAttrValue:
    case HTMLStateTypes.attrValueUnquoted:
        return escapingContextTypes.HTMLAttrValueUnquoted;

    case HTMLStateTypes.attrValueSingleQuoted:
    case HTMLStateTypes.attrValueDoubleQuoted:
        return escapingContextTypes.HTMLAttrValueQuoted;
    }

    return escapingContextTypes.Unknown;
};

export const extractText = obj => {
    if (typeof obj === 'string') {
        return obj;
    }

    const objProto = Object.getPrototypeOf(obj);
    if (obj.hasOwnProperty('text') ||
        (objProto && objProto.hasOwnProperty('text'))) {
        return obj.text;
    }

    if ('toString' in obj) {
        return '' + obj;
    }

    return '';
};
