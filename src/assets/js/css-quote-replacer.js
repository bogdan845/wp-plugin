import '../sass/main.scss'


/*
.qrep {
    position: relative;

&:before {
        content: "\201E";
        line-height: 1;
    }

&:after {
        content: "\201D ";
        line-height: 1;
    }
}
*/

const {wp} = window;
const {registerFormatType, toggleFormat} = wp.richText;
const {RichTextToolbarButton, RichTextShortcut} = wp.editor;
const {createElement, Fragment} = wp.element;


window._wpLoadBlockEditor.then(function () {
    [{
        name: 'custom-core/quotes',
        title: 'Add quotes',
        character: ',',
        icon: 'editor-quote',
    }].forEach(({name, title, character, icon}) => {
        const type = 'custom-core/quotes';
        registerFormatType(type, {
            name,
            title,
            tagName: 'span',
            className: 'qrep',
            edit(arg) {
                let value = {...arg.value};
                const {start, end} = value;
                const onChange = arg.onChange;
                const isActive = arg.isActive;

                const onToggle = () => {
                    const possibleQuotesSymbol = [
                        '\u0022',
                        '\u0027',
                        '\u00AB',
                        '\u00BB',
                        '\u2018',
                        '\u2019',
                        '\u201A',
                        '\u201C',
                        '\u201D',
                        '\u201E',
                        '\u2039',
                        '\u203A'
                    ];

                    value.text = value.text.split('').map((item, index) => {
                        if (index >= start && index < end) {
                            if (possibleQuotesSymbol.includes(item)) item = '';
                        }
                        return item;
                    });
                    value.text = value.text.join('') + ' ';

                    onChange(
                        toggleFormat(value, {
                            type,
                            attributes: {
                                'data-qrep': 'quote',
                            },
                        })
                    );
                };

                return (
                    createElement(Fragment, null,
                        createElement(RichTextShortcut, {
                            type: 'primary',
                            character,
                            onUse: onToggle,
                        }),
                        createElement(RichTextToolbarButton, {
                            icon,
                            title,
                            onClick: onToggle,
                            isActive,
                            shortcutType: 'primary',
                            shortcutCharacter: character,
                        })
                    )
                )
            }
        })
    })
});


// const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
//
//     return (props) => {
//         return (
//             <Fragment>
//                 <BlockControls>
//                     <RichTextToolbarButton
//
//                     />
//                 </BlockControls>
//                 <BlockEdit {...props} />
//             </Fragment>
//         );
//     };
// }, "withInspectorControl");
//
// wp.hooks.addFilter('editor.BlockEdit', 'my-plugin/with-inspector-controls', withInspectorControls);


// const {createElement, Fragment} = window.wp.element;
// const {registerFormatType, toggleFormat} = window.wp.richText;
// const {RichTextToolbarButton, RichTextShortcut} = window.wp.editor;
// const {createHigherOrderComponent} = wp.compose;
// const {InspectorControls, BlockControls} = wp.editor;
// const {PanelBody, Toolbar} = wp.components;

// [
//     {
//         name: 'test',
//         title: 'Change quotes',
//         character: ',',
//         icon: 'editor-quote',
//     }
// ].forEach(({name, title, character, icon}) => {
//     const type = `advanced/${name}`;
//
//     registerFormatType(type, {
//         title,
//         tagName: 'span',
//         className: 'qqq',
//         edit({isActive, value, onChange}) {
//             // const clonedValue = {...value};
//             // let text = clonedValue.text;
//             // let start = clonedValue.start;
//             // let end = clonedValue.end;
//             // let textToArr = text.split('');
//
//
//             // const test = textToArr.map((item, index) => {
//             //     if (index === start) item = '„' + item;
//             //     if (index === end - 1) item = item + '“';
//             //     return item
//             // });
//             // console.log(test.join('').length);
//             // console.log(text.length);
//
//
//             // possible quotes
//             let possibleQuotesSymbol = [
//                 '«',
//                 '‹',
//                 '»',
//                 '›',
//
//                 '„',
//                 '“',
//
//                 '‟',
//                 '”',
//
//                 // '’',
//                 // '’',
//
//                 '❝',
//                 '❞',
//
//                 '❮',
//                 '❯',
//
//                 '⹂',
//                 '〝',
//
//                 '〞',
//                 '〟',
//
//                 '＂',
//                 // '‚',
//
//                 '‘',
//                 '‛',
//
//                 '❛',
//                 '❛',
//                 '❜',
//                 '"',
//                 '\'',
//                 '<',
//                 '>'
//             ];
//
//             // const addQuotes = (data) => {
//             //     if (possibleQuotesSymbol.includes(data[start]) && possibleQuotesSymbol.includes(data[end - 1])) {
//             //         data.splice(start, 1, '„');
//             //         data.splice(end - 1, 1, '“');
//             //         return data.join('');
//             //     }
//             //     return data.join('');
//             // if (possibleQuotesSymbol.includes(data[start])) {
//             //     data.splice(start, 1, '„');
//             //     data.splice(end, 1, '“');
//             //     return data.join('');
//             // }
//             // if (possibleQuotesSymbol.includes(data[end - 1])) {
//             //     data.splice(start, 0, '„');
//             //     data.splice(end, 1, '“');
//             //     return data.join('');
//             // }
//             // if (text) {
//             //    data.start.splice()
//             //
//             // }
//             // }
//             // clonedValue.text = addQuotes(textToArr);
//             // if (test.join('').length > text.length) {
//             //     text = test.join('');
//             //     console.log(text.length);
//             // }
//             // clonedValue.text = text + 'q';
//
//             const clonedValue = {...value};
//             let text = clonedValue.text;
//             let start = clonedValue.start;
//             let end = clonedValue.end;
//             let textToArr = text.split('');
//
//             const test = textToArr.map((item, index) => {
//                 if (index === start) item = '„' + item;
//                 if (index === end - 1) item = item + '“';
//                 return item
//             });
//
//             console.log(text.length);
//             console.log(value)
//
//
//
//             // clonedValue.forms = test.length;
//             clonedValue.text = test.join('');
//
//
//             const onToggle = () => {
//                 onChange(
//                     toggleFormat(clonedValue, {type})
//                 )
//             }
//
//             return (
//                 createElement(Fragment, null,
//                     createElement(RichTextShortcut, {
//                         type: 'primary',
//                         character,
//                         onUse: onToggle
//                     }),
//                     createElement(RichTextToolbarButton, {
//                         icon,
//                         title,
//                         onClick: onToggle,
//                         isActive,
//                         shortcutType: 'primary',
//                         shortcutCharacter: character,
//                         className: `toolbar-button-with-text toolbar-button__advanced-${name}`
//                     })
//                 )
//             )
//         }
//     })
// })