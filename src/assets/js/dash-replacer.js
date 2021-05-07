const {wp} = window;
const {addFilter} = wp.hooks;
const {createHigherOrderComponent} = wp.compose;

/*
* Find needed keys in object and replace "--" to " – "
*
* finKeys
*   obj - object where keys are searched
*   target - array of needed keys
*
* keyRecurse (recursive function)
*   obj - taken from findKeys function
*   item - name of keys from obj
*
* */

const findKeys = (obj, target) => {
    const keysRecurse = (obj, item) => {
        Object.keys(obj).map(key => {
            let current = obj[key];
            if (!current) return;
            if (current && typeof current === 'object') {
                keysRecurse(current, key)
            }
            if (target.includes(key)) {
                obj[key] = obj[key].replaceAll('--', '–');
            }
        });
    };
    keysRecurse(obj);
};


/*
* Create arr with default block names and their fields with content
*
* arrForCheck
*   arr - source array
*   blockName - block name
*   contentKey - key name where stores content
*
* */
const buildArrForCheck = (arr, blockName, contentKey) => {
    let isAvailable = arr.find(target => target.name === blockName);
    if (!isAvailable) {
        arr.push({
            name: blockName,
            keys: [contentKey]
        })
    } else {
        arr.forEach(item => {
            if (item.name === blockName) item.keys.push(contentKey);
        })
    }
};


/*
* Replace dash (hyphen)
* */
window._wpLoadBlockEditor.then(function () {
    const arrForCheck = [];
    const getAllBlocks = wp.data.select('core/blocks').getBlockTypes();
    const dataFromBlocks = (data) => {
        data.map(block => {
            Object.keys(block.attributes).forEach(key => {
                let current = block.attributes[key];
                if (key === 'body') {
                    const bodyRecurse = (current, nextKey) => {
                        Object.keys(current).forEach(bodyKey => {
                            let currentBody = current[bodyKey];
                            if (!bodyKey) return;
                            if (currentBody && typeof currentBody === 'object') {
                                bodyRecurse(currentBody, bodyKey)
                            }
                            if (bodyKey === 'content') {
                                if (currentBody.source && currentBody.source === 'html') {
                                    buildArrForCheck(arrForCheck, block.name, bodyKey)
                                }
                            }
                        })
                    };
                    bodyRecurse(current);
                } else {
                    Object.keys(current).forEach(sourceKey => {
                        if (sourceKey === 'source' && current[sourceKey] === 'html') {
                            buildArrForCheck(arrForCheck, block.name, key)
                        }
                    })
                }
            })
        })
    };
    dataFromBlocks(getAllBlocks);


    /*
    * Save function
    * */
    addFilter(
        'blocks.getSaveElement',
        'jb/core-button',
        (element, block, attributes) => {
            if ('core/button' !== block.name) {
                const clonedElement = {...element};
                Object.keys(arrForCheck).forEach(key => {
                    if (arrForCheck[key].name === block.name) {
                        findKeys(clonedElement, arrForCheck[key].keys);
                    }
                });
            }
            return element;
        }
    );

    /*
    * Edit function
    * */
    const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            if ('core/button' !== props.name) {
                const clonedProps = {...props};
                Object.keys(clonedProps).forEach(key => {
                    arrForCheck.forEach(item => {
                        if (item.name === clonedProps[key]) {
                            findKeys(clonedProps, item.keys);
                            return <BlockEdit {...clonedProps} />;
                        }
                    })
                });
            }
            return <BlockEdit {...props} />;
        };
    }, 'withInspectorControl');
    addFilter('editor.BlockEdit', 'jb/core-button', withInspectorControls);
});

// const testArr = [];
// const test = (data) => {
//     data.map(inner => {
//         Object.keys(inner.attributes).forEach(key => {
//             let current = inner.attributes[key];
//             if (key === 'body') {
//                 let currentBody = inner.attributes[key];
//                 const recurse = (currentBody, item) => {
//                     Object.keys(currentBody).forEach(bodyKey => {
//                         if (bodyKey === 'undefined') return;
//
//                         if (currentBody[bodyKey] && typeof currentBody[bodyKey] === 'object') {
//                             recurse(currentBody[bodyKey], bodyKey)
//                         }
//
//                         if (bodyKey === 'content') {
//                             if (currentBody[bodyKey].source === 'html') {
//                                 let checkTestArr = testArr.find(target => target.name === inner.name);
//                                 if (!checkTestArr) {
//                                     testArr.push({
//                                         name: inner.name,
//                                         targets: [bodyKey]
//                                     })
//                                 } else {
//                                     testArr.forEach(item => {
//                                         if (item.name === inner.name) item.targets.push(bodyKey)
//                                     })
//                                 }
//                             }
//                         }
//                     })
//                 }
//                 recurse(currentBody);
//             } else {
//                 Object.keys(current).forEach(subKey => {
//                     if (subKey === 'source' && current[subKey] === 'html') {
//                         let checkTestArr = testArr.find(target => target.name === inner.name)
//                         if (!checkTestArr) {
//                             testArr.push({
//                                 name: inner.name,
//                                 targets: [key]
//                             })
//                         } else {
//                             testArr.forEach(item => {
//                                 if (item.name === inner.name) item.targets.push(key);
//                             })
//                         }
//                     }
//                 })
//             }
//         })
//     })
// }
// test(getAllBlocks)
// console.log(testArr)


// recurse(data)


// data.map(block => {
//     Object.keys(block.attributes).forEach(key => {
//         let current = block.attributes[key];
//         Object.keys(current).forEach(subKey => {
//             if (subKey === 'source' && current[subKey] === 'html') {
//                 // console.log('name:', block.name, 'key:', current[subKey], 'type:', key);
//                 let checkArr = testArr.find(item => item.name === block.name);
//                 if (!checkArr) {
//                     testArr.push({
//                         name: block.name,
//                         targets: [key]
//                     })
//                 } else {
//                     testArr.forEach(item => {
//                         if (item.name === block.name) {
//                             item.targets.push(key)
//                         }
//                     })
//                 }
//             }
//         })
//     })
// })

// const testArr = [];
// const test = (data) => {
//     // const recurse = (data) => {
//     data.map(block => {
//         Object.keys(block.attributes).forEach(key => {
//             let current = block.attributes[key];
//             Object.keys(current).forEach(subKey => {
//                 if (subKey === 'source' && current[subKey] === 'html') {
//                     // console.log('name:', block.name, 'key:', current[subKey], 'type:', key);
//                     let checkArr = testArr.find(item => item.name === block.name);
//                     if (!checkArr) {
//                         testArr.push({
//                             name: block.name,
//                             targets: [key]
//                         })
//                     } else {
//                         testArr.forEach(item => {
//                             if (item.name === block.name) {
//                                 item.targets.push(key)
//                             }
//                         })
//                     }
//                 }
//             })
//         })
//     })
// }

// console.log(testArr)
// let current = data[key].attributes;
// console.log(current);
// Object.keys(current).forEach(subKey => {
//     if (current[subKey].source && current[subKey].source === 'html') {
//         console.log(subKey)
//     }
// })


// if (current !== 'undefined') {

// console.log(data[key])
// if (current && typeof current === 'object') {
//     recurse(current, key)
// }
// if (key === 'html') {
//     console.log(key, current)
// }
// if (key === 'query') {
//     Object.keys(data[key]).map(subKey => {
//         if (subKey === 'content') {
//             console.log(subKey)
//         }
//     })
// }
// }
// })
// }
// recurse(data)
// console.log(testArr);
// test(getAllBlocks);


// console.log(customObj);

// Save function
// addFilter(
//     'blocks.getSaveElement',
//     'jb/core-button',
//     (element, block, attributes) => {

// block.forEach(item => {
//     if (item.name.includes)
// })

// const lib = lib();
// const find = lib.find( ({name}) => name === element.name );
// if ( find ) {
//     const clonedElement = {...element};
//     findKeys(clonedElement, keys);
//     return clonedElement;
// }
// return element;
// }
// );


// Edit function
// const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
//     return (props) => {
//         if ('core/button' !== props.name) {
//             const clonedProps = {...props};
//             findKeys(clonedProps, ['content', 'values', 'value', 'citation']);
// return <BlockEdit {...props} />;
// }
// return <BlockEdit {...props} />;
// };
// }, 'withInspectorControl');
// addFilter('editor.BlockEdit', 'jb/core-button', withInspectorControls);


// wp.data.select('core/editor').getCurrentPost().content.replace(RegExp("( - )(?!([^<]+)?>)", "gi"), "–")
// wp.data.select('core/editor').getCurrentPost().content.replace(RegExp("(\")(?!([^<]+)?>)", "gi"), "").
//wp.data.select('core/editor').getCurrentPost().content.replace(/(<([^>]+)>)/gi, "")


