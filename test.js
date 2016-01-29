import { sanitize } from './src/sanitize';

console.log(
    sanitize`<div data-a=${123} data-attr=${'&"\'+<>=`'}>${'&"\'+<>=`'}</div>`
);
