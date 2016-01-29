export const HTMLStateTypes = {
    data:                  1,
    tagOpen:               8,
    endTagOpen:            9,
    tagName:               10,
    beforeAttrName:        34,
    attrName:              35,
    afterAttrName:         36,
    beforeAttrValue:       37,
    attrValueDoubleQuoted: 38,
    attrValueSingleQuoted: 39,
    attrValueUnquoted:     40,
    afterAttrQuotedValue:  42,
    selfClosingStart:      43
};

export const escapingContextTypes = {
    HTML:                  0,
    HTMLAttr:              1,
    HTMLAttrValueUnquoted: 2,
    HTMLAttrValueQuoted:   3,
    URL:                   3,
    Unknown:               4
};

export const replacementTables = {
    HTML: {
        // http://www.w3.org/TR/html5/syntax.html#attribute-value-(unquoted)-state
        // U+0000 NULL Parse error. Append a U+FFFD REPLACEMENT
        // CHARACTER character to the current attribute's value.
        // "
        // and similarly
        // http://www.w3.org/TR/html5/syntax.html#before-attribute-value-state
        '\0': '\ufffd',
        '"':  '&#34;',
        '&':  '&amp;',
        '\'': '&#39;',
        '+':  '&#43;',
        '<':  '&lt;',
        '>':  '&gt;'
    },
    // HTMLNorm is like HTML but without '&' to
    // avoid over-encoding existing entities.
    HTMLNorm: {
        '\0': '\ufffd',
        '"':  '&#34;',
        '\'': '&#39;',
        '+':  '&#43;',
        '<':  '&lt;',
        '>':  '&gt;'
    },
    // HTMLNospace contains the runes that need to be escaped
    // inside an unquoted attribute value.
    // The set of runes escaped is the union of the HTML specials and
    // those determined by running the JS below in browsers:
    // <div id=d></div>
    // <script>(function () {
    // var a = [], d = document.getElementById("d"), i, c, s;
    // for (i = 0; i < 0x10000; ++i) {
    //   c = String.fromCharCode(i);
    //   d.innerHTML = "<span title=" + c + "lt" + c + "></span>"
    //   s = d.getElementsByTagName("SPAN")[0];
    //   if (!s || s.title !== c + "lt" + c) { a.push(i.toString(16)); }
    // }
    // document.write(a.join(", "));
    // })()</script>
    HTMLNospace: {
	'\0': '&#xfffd;',
	'\t': '&#9;',
	'\n': '&#10;',
	'\v': '&#11;',
	'\f': '&#12;',
	'\r': '&#13;',
	' ':  '&#32;',
	'"':  '&#34;',
	'&':  '&amp;',
	'\'': '&#39;',
	'+':  '&#43;',
	'<':  '&lt;',
	'=':  '&#61;',
	'>':  '&gt;',
	// A parse error in the attribute value (unquoted) and
	// before attribute value states.
	// Treated as a quoting character by IE.
	'`':  '&#96;'
    },
    // HTMLNospaceNorm is like HTMLNospace but
    // without '&' to avoid over-encoding existing entities.
    HTMLNospaceNorm: {
	'\0': '&#xfffd;',
	'\t': '&#9;',
	'\n': '&#10;',
	'\v': '&#11;',
	'\f': '&#12;',
	'\r': '&#13;',
	' ':  '&#32;',
	'"':  '&#34;',
	'\'': '&#39;',
	'+':  '&#43;',
	'<':  '&lt;',
	'=':  '&#61;',
	'>':  '&gt;',
	// A parse error in the attribute value (unquoted) and
	// before attribute value states.
	// Treated as a quoting character by IE.
	'`':  '&#96;'
    }
};
