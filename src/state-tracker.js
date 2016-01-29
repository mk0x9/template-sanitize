import { isASCII, isWhitespace, HTMLStateToEscapingContext } from './helpers';
import { HTMLStateTypes } from './enums';

export const analyze = strings => {
    let currentHTMLState = HTMLStateTypes.data,
        processedStrings = [],
        backtrackingString = '';

    for (let stringIdx = 0; stringIdx < strings.length; stringIdx++) {
        const currentString = strings[stringIdx];

        let peek = false;
        for (let cIdx = 0; cIdx < currentString.length; cIdx++) {
            const c = currentString[cIdx];

            if (peek) {
                cIdx--;
                backtrackingString = backtrackingString.slice(0, -1);
            }

            peek = false;
            backtrackingString += c;

            switch (currentHTMLState) {
            case HTMLStateTypes.data:
                switch (c) {
                case '<':
                    currentHTMLState = HTMLStateTypes.tagOpen;
                    break;

                case '\0':
                    throw new SyntaxError('data: NULL');
                    break;
                }
                break;

            case HTMLStateTypes.tagOpen:
                switch (true) {
                case c === '/':
                    break;

                case isASCII(c):
                    currentHTMLState = HTMLStateTypes.tagName;
                    break;

                default:
                    throw new SyntaxError('tagOpen: ' + c);
                }
                break;

            case HTMLStateTypes.tagName:
                switch (true) {
                case isWhitespace(c):
                    currentHTMLState = HTMLStateTypes.beforeAttrName;
                    break;

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                case c === '/':
                    currentHTMLState = HTMLStateTypes.selfClosingStart;
                    break;

                case c === '\0':
                    throw new SyntaxError('tagName: NULL');
                }
                break;

            case HTMLStateTypes.selfClosingStart:
                switch (c) {
                case '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                default:
                    throw new SyntaxError('selfClosingStart');
                }
                break;

            case HTMLStateTypes.beforeAttrName:
                switch (true) {
                case isWhitespace(c):
                    break;

                case c === '/':
                    currentHTMLState = HTMLStateTypes.selfClosingStart;
                    break;

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                case c === '\0':
                    throw new SyntaxError('beforeAttrName: NULL');

                case c === '"' || c === '\'' || c === '<' || c === '=':
                    // parse error, but doesn't barf
                    break;

                default:
                    currentHTMLState = HTMLStateTypes.attrName;
                    break;
                }
                break;

            case HTMLStateTypes.attrName:
                switch (true) {
                case isWhitespace(c):
                    currentHTMLState = HTMLStateTypes.afterAttrName;
                    break;

                case c === '/':
                    currentHTMLState = HTMLStateTypes.selfClosingStart;
                    break;

                case c === '=':
                    currentHTMLState = HTMLStateTypes.beforeAttrValue;
                    break;

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                case c === '\0':
                    throw new SyntaxError('attrName');

                case c === '"' || c === '\'' || c === '<':
                    // parse error, but doesn't barf
                    break;
                }
                break;

            case HTMLStateTypes.afterAttrName: {
                switch (true) {
                case isWhitespace(c):
                    break;

                case c === '/':
                    currentHTMLState = HTMLStateTypes.selfClosingStart;
                    break;

                case c === '=':
                    currentHTMLState = HTMLStateTypes.beforeAttrValue;
                    break;

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                case c === '\0':
                    throw new SyntaxError('afterAttrName');
                }
            }

            case HTMLStateTypes.beforeAttrValue:
                switch (true) {
                case isWhitespace(c):
                    break;

                case c === '"':
                    currentHTMLState = HTMLStateTypes.attrValueDoubleQuoted;
                    break;

                case c === '&':
                    currentHTMLState = HTMLStateTypes.attrValueUnquoted;
                    peek = true; // reconsume
                    break;

                case c === '\'':
                    currentHTMLState = HTMLStateTypes.attrValueSingleQuoted;
                    break;

                case c === '\0':
                    // not implemented
                    throw new SyntaxError('beforeAttrValue: not implemented');

                case c === '>':
                    // parse error, doesn't barf
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                default:
                    // not implemented
                    throw new SyntaxError('beforeAttrValue: not implemented');
                }
                break;

            case HTMLStateTypes.attrValueUnquoted:
                switch (true) {
                case isWhitespace(c):
                    currentHTMLState = HTMLStateTypes.beforeAttrValue;
                    break;

                case c === '&':
                    // not implemented
                    throw new SyntaxError('attrValueUnquoted: not implemented');

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                case c === '\0':
                    throw new SyntaxError('attrValueUnquoted');

                case c === '\'' || c === '<' || c === '=' || c === '`':
                    // parse error, doesn't barf
                    break;
                }
                break;

            case HTMLStateTypes.attrValueSingleQuoted:
                switch (c) {
                case '\'':
                    currentHTMLState = HTMLStateTypes.afterAttrQuotedValue;
                    break;

                case '&':
                    // not implemented
                    throw new SyntaxError('attrValueSingleQuoted: not implemented');
                }
                break;

            case HTMLStateTypes.attrValueDoubleQuoted:
                switch (c) {
                case '"':
                    currentHTMLState = HTMLStateTypes.afterAttrQuotedValue;
                    break;

                case '&':
                    // not implemented
                    throw new SyntaxError('attrValueDoubleQuoted: not implemented');
                }
                break;

            case HTMLStateTypes.afterAttrQuotedValue:
                switch (true) {
                case isWhitespace(c):
                    currentHTMLState = HTMLStateTypes.beforeAttrName;
                    break;

                case c === '/':
                    currentHTMLState = HTMLStateTypes.selfClosingStart;
                    break;

                case c === '>':
                    currentHTMLState = HTMLStateTypes.data;
                    break;

                default:
                    // parse error, doesn't barf
                    currentHTMLState = HTMLStateTypes.beforeAttrName;
                    break;
                }
                break;

            default:
                throw new SyntaxError('unhandled state: ' + currentHTMLState[0]);
            }
        }

        processedStrings.push({
            string: strings[stringIdx],
            escapingContext: HTMLStateToEscapingContext(currentHTMLState)
        });
    }

    return processedStrings;
};
