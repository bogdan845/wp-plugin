import slugify from "slugify";

const el = wp.element.createElement;
const {subscribe} = wp.data;
const {isSavingPost, isAutosavingPost} = wp.data.select('core/editor');


function whileSavingPost(callback) {
    let savingCycle = 0;
    subscribe(() => {
        isSavingPost() && !isAutosavingPost() ? savingCycle++ : (savingCycle = 0);
        if (savingCycle === 1) {
            callback();
        }
    });
}


whileSavingPost(() => {
    const activeBlocks = wp.data.select('core/editor').getBlocks();
    const getAdsBlock = activeBlocks.filter(item => item.name === 'ads-handler/ads');
    const keyToSLug = [...getAdsBlock].map(item => {
        Object.keys(item.attributes).map(key => {
            item.attributes[key] = slugify(item.attributes[key], {
                replacement: '_',
                lower: true,
            });
        });
        return item;
    });
    jQuery
        .post(example.ajax_url, {
            action: "ads_ajax",
            post_url: window.location.href,
            ads: getAdsBlock.map(item => item.attributes),
        })
        .success((response) => {
                console.log(response);
            }
        );
});


wp.blocks.registerBlockType('ads-handler/ads', {
    title: 'Ads',
    icon: 'screenoptions',
    category: 'common',
    attributes: {
        desktop: {type: 'string'},
        tablet: {type: 'string'},
        mobile: {type: 'string'},
    },

    edit: function (props) {

        // whileSavingPost(() => {
        //     jQuery
        //         .post(example.ajax_url, {
        //             action: "ads_ajax",
        //             post_url: window.location.href,
        //             mobile: props.attributes.mobile,
        //             tablet,
        //             desktop
        // })
        // .success((response) => {
        //         console.log(response);
        //     }
        // );
        // });

        function onChange(event, device) {
            return props.setAttributes({[device]: event.target.value});
        }

        return el('div',
            {
                className: 'notice-box notice-' + props.attributes.type
            },
            ['desktop', 'tablet', 'mobile'].map(device => {
                return el(
                    'input',
                    {
                        type: 'text',
                        placeholder: 'Enter tag here',
                        value: props.attributes[device],
                        onChange: (event) => onChange(event, device),
                        style: {width: '33%'}
                    }
                )
            })
        );
    },

    save: function (props) {
        const parseReplacer = (device) => {
            const start = 'startZ0t_QmRHEO7G_JJUgQJcIJ';
            const end = 'endZ0t_QmRHEO7G_JJUgQJcIJ';
            const value = JSON.stringify({
                device,
                tag: props.attributes[device],
            });
            return start + value + end;
        };

        return el('div', {
                className: 'notice-box notice-' + props.attributes.type,
            },
            ['desktop', 'tablet', 'mobile'].map(device => {
                return el(
                    'div',
                    null,
                    parseReplacer(device)
                )
            })
        )
    }
});

