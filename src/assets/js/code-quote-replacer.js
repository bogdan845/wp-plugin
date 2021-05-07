const {wp} = window;
const {insert, applyFormat} = wp.richText;
const {registerFormatType, toggleFormat} = wp.richText;
const {RichTextToolbarButton, RichTextShortcut} = wp.editor;
const {createElement, Fragment} = wp.element;
const {select, subscribe, dispatch} = wp.data;


window._wpLoadBlockEditor.then(function () {
    console.log(wp.richText);
    console.log(wp.data.select('core/editor'));
    [{
        name: 'custom-core/quotes',
        title: 'Add quotes',
        character: ',',
        icon: 'editor-quote',
    }].forEach(({name, title, character, icon}) => {
        const type = `custom-core/quotes`;
        registerFormatType('add-quotes/button', {
            name,
            title,
            tagName: 'span',
            className: 'qrep',
            attributes: {
                data: 'red'
            },
            edit: (arg) => {
                let value = {...arg.value};
                const onChange = arg.onChange;
                const {start} = value;
                let {end} = value;
                const isActive = arg.isActive;


                const addQuotes = () => {
                    let selectedText = value.text.substring(start, end);
                    // const possibleQuotes = [
                    //     '«',
                    //     '»',
                    //
                    //     '‹',
                    //     '›',
                    //
                    //     '„',
                    //     '“',
                    //
                    //     '‟',
                    //     '”',
                    //
                    //     '’',
                    //     '’',
                    //
                    //     '❝',
                    //     '❞',
                    //
                    //     '❮',
                    //     '❯',
                    //
                    //     '⹂',
                    //     '〝',
                    //
                    //     '〞',
                    //     '〟',
                    //
                    //     '＂',
                    //
                    //     '‚',
                    //     '‘',
                    //     '‛',
                    //
                    //     '❛',
                    //     '❜',
                    //     '❟',
                    //
                    //     '"',
                    //     '\'',
                    //     '<',
                    //     '>'
                    // ];
                    // const possibleQuotes = [
                    //     'U+00AB',
                    //     'U+2039',
                    //     'U+00BB',
                    //     'U+203A',
                    //     'U+201E',
                    //     'U+201C',
                    //     'U+201F',
                    //     'U+201D',
                    //     'U+2019',
                    //     'U+0022',
                    //     'U+275D',
                    //     'U+275E',
                    //     'U+276E',
                    //     'U+276F',
                    //     'U+2E42',
                    //     'U+301D',
                    //     'U+301E',
                    //     'U+301F',
                    //     'U+FF02',
                    //     'U+201A',
                    //     'U+2018',
                    //     'U+201B',
                    //     'U+275B',
                    //     'U+275C',
                    //     'U+275F'
                    // ];

                    // if (possibleQuotes.indexOf(selectedText)) {
                    //     selectedText = selectedText.split('').filter(item => !possibleQuotes.includes(item));
                    // }
                    console.log(start);
                    selectedText = selectedText.replace(
                        '[\u0022\u0027\u00AB\u00BB\u2018\u2019\u201A\u201C\u201D\u201E\u2039\u203A]',
                        ''
                    );
                    if (selectedText.length) {
                        const updatedText = '„' + selectedText + '“';
                        const setLength = updatedText.length - selectedText.length + end;
                        value = applyFormat(insert(value, updatedText), {
                            type: 'custom-core/quotes',
                            attributes: {slug: 'slug-' + start}
                        }, start, setLength);
                    }
                    if (isActive) {
                        let startPoint = start;
                        value.text = value.text.split('');

                        console.log(start);

                        const findPrev = (value, prev) => {
                            if (value.join('').charAt(prev) === '\u201E') {
                                return value.splice(prev, 1)
                            }
                            findPrev(value, prev - 1);
                        };
                        findPrev(value.text, startPoint);

                        const findNext = (value, next) => {
                            if (value.join('').charAt(next) === '\u201C') {
                                return value.splice(next, 1);
                            }
                            findNext(value, next + 1);
                        };
                        findNext(value.text, startPoint);
                        value.text = value.text.join('');
                    }

                    onChange(toggleFormat(value, {
                            type: 'custom-core/quotes',
                            attributes: {slug: 'slug-' + start}
                        })
                    );

                    console.log(value.text.length)
                };

                return (
                    createElement(Fragment, null,
                        createElement(RichTextShortcut, {
                            type: 'primary',
                            character,
                            onUse: addQuotes,
                        }),
                        createElement(RichTextToolbarButton, {
                            onClick: addQuotes,
                            title: 'Add quotes',
                            icon,
                            className: 'toolbar-button-replace-quotes'
                        })
                    )
                )
            }
        });
    })
});

// const {createHigherOrderComponent} = wp.compose;
// const {__} = window.wp.i18n;
// const {RichTextToolbarButton, RichTextShortcut, BlockControls} = wp.editor;