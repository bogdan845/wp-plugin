window._wpLoadBlockEditor.then(function () {
    const {registerPlugin} = wp.plugins;
    const {PluginPostStatusInfo} = wp.editPost;
    const PluginContentLength = () => {
        const postCharacters = wp.richText
            .create({
                html: wp.data.select('core/editor')
                    .getCurrentPost().content
            })
            .text.replaceAll(" ", "").length;
        return (
            <PluginPostStatusInfo>
                <span>Post length</span>
                <span>{postCharacters} chars</span>
            </PluginPostStatusInfo>
        );
    };
    registerPlugin('post-length', {
        render: PluginContentLength
    });
});


// import {registerPlugin} from "@wordpress/plugins";
// import {PluginSidebar} from "@wordpress/edit-post";
// import {__} from "@wordpress/i18n";
//
//
//
//
// window._wpLoadBlockEditor.then(function () {
//     registerPlugin('myprefix-sidebar', {
//         icon: 'smiley',
//         render: () => {
//             return (
//                 <>
//                     <PluginSidebar title={__('Meta Options', 'textdomain')}>
//                         Some Content
//                     </PluginSidebar>
//                 </>
//             )
//         }
//     });
// });

// import { TabPanel } from '@wordpress/components';
//
// const onSelect = ( tabName ) => {
//     console.log( 'Selecting tab', tabName );
// };
//
// const MyTabPanel = () => (
//     <TabPanel
//         className="my-tab-panel"
//         activeClass="active-tab"
//         onSelect={ onSelect }
//         tabs={ [
//             {
//                 name: 'tab1',
//                 title: 'Tab 1',
//                 className: 'tab-one',
//             },
//             {
//                 name: 'tab2',
//                 title: 'Tab 2',
//                 className: 'tab-two',
//             },
//         ] }
//     >
//         { ( tab ) => <p>{ tab.title }</p> }
//     </TabPanel>
// );


// var __ = wp.i18n.__;
// var PluginPostPublishPanel = wp.editPost.PluginPostPublishPanel;


// function MyPluginPostPublishPanel() {
//     return wp.element.createElement(
//         PluginPostPublishPanel,
//         {
//             className: 'my-plugin-post-publish-panel',
//             title: __('My panel title'),
//             initialOpen: true,
//         },
//         __('My panel content')
//     );
// }
// MyPluginPostPublishPanel();

// /**
//  * WordPress Dependencies
//  */
// const { __ } = wp.i18n;
// const { addFilter } = wp.hooks;
// const { Fragment }	= wp.element;
// const { InspectorAdvancedControls }	= wp.editor;
// const { createHigherOrderComponent } = wp.compose;
// const { ToggleControl } = wp.components;
//
// //restrict to specific block names
// const allowedBlocks = [ 'core/paragraph', 'core/heading' ];
//
// /**
//  * Add custom attribute for mobile visibility.
//  *
//  * @param {Object} settings Settings for the block.
//  *
//  * @return {Object} settings Modified settings.
//  */
// function addAttributes( settings ) {
//
//     //check if object exists for old Gutenberg version compatibility
//     //add allowedBlocks restriction
//     if( typeof settings.attributes !== 'undefined' && allowedBlocks.includes( settings.name ) ){
//
//         settings.attributes = Object.assign( settings.attributes, {
//             visibleOnMobile:{
//                 type: 'boolean',
//                 default: true,
//             }
//         });
//
//     }
//
//     return settings;
// }
//
// /**
//  * Add mobile visibility controls on Advanced Block Panel.
//  *
//  * @param {function} BlockEdit Block edit component.
//  *
//  * @return {function} BlockEdit Modified block edit component.
//  */
// const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
//     return ( props ) => {
//
//         const {
//             name,
//             attributes,
//             setAttributes,
//             isSelected,
//         } = props;
//
//         const {
//             visibleOnMobile,
//         } = attributes;
//
//
//         return (
//             <Fragment>
//                 <BlockEdit {...props} />
//                 //add allowedBlocks restriction
//                 { isSelected && allowedBlocks.includes( name ) &&
//                 <InspectorAdvancedControls>
//                     <ToggleControl
//                         label={ __( 'Mobile Devices Visibity' ) }
//                         checked={ !! visibleOnMobile }
//                         onChange={ () => setAttributes( {  visibleOnMobile: ! visibleOnMobile } ) }
//                         help={ !! visibleOnMobile ? __( 'Showing on mobile devices.' ) : __( 'Hidden on mobile devices.' ) }
//                     />
//                 </InspectorAdvancedControls>
//                 }
//
//             </Fragment>
//         );
//     };
// }, 'withAdvancedControls');
//
// /**
//  * Add custom element class in save element.
//  *
//  * @param {Object} extraProps     Block element.
//  * @param {Object} blockType      Blocks object.
//  * @param {Object} attributes     Blocks attributes.
//  *
//  * @return {Object} extraProps Modified block element.
//  */
// function applyExtraClass( extraProps, blockType, attributes ) {
//
//     const { visibleOnMobile } = attributes;
//
//     //check if attribute exists for old Gutenberg version compatibility
//     //add class only when visibleOnMobile = false
//     //add allowedBlocks restriction
//     if ( typeof visibleOnMobile !== 'undefined' && !visibleOnMobile && allowedBlocks.includes( blockType.name ) ) {
//         extraProps.className = classnames( extraProps.className, 'mobile-hidden' );
//     }
//
//     return extraProps;
// }
//
// //add filters
//
// addFilter(
//     'blocks.registerBlockType',
//     'editorskit/custom-attributes',
//     addAttributes
// );
//
// addFilter(
//     'editor.BlockEdit',
//     'editorskit/custom-advanced-control',
//     withAdvancedControls
// );
//
// addFilter(
//     'blocks.getSaveContent.extraProps',
//     'editorskit/applyExtraClass',
//     applyExtraClass
// );