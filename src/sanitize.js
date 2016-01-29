import { analyze } from './state-tracker';
import { escape } from './escape';
import { replacementTables, escapingContextTypes } from './enums';
import { HTMLStateToEscapingContext, extractText } from './helpers';

export function sanitize(strings) {
    const variables = [].slice.call(arguments, 1);
    const analyzed = analyze(strings);

    let result = '';

    for (var idx = 0; idx < analyzed.length - 1; idx++) {
        let current = analyzed[idx],
            replacementTable = replacementTables.HTML;

        switch (current.escapingContext) {
        case escapingContextTypes.HTMLAttrValueUnquoted:
            replacementTable = replacementTables.HTMLNospace;
            break;
        }

        result += current.string + escape(extractText(variables[idx]), replacementTable);
    }

    result += analyzed[idx].string;

    return result;
};

//window['sanitize'] = sanitize;
