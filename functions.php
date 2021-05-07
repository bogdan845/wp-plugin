<?php


// ToDo
// unique keys to string
// slugify (values from gutenberg)
// prepare array

add_filter('show_admin_bar', '__return_false');

function styles_scripts_enqueue_assets()
{
    wp_enqueue_script('index', plugins_url('/dist/main.js', __FILE__), array(), null, true);
    wp_localize_script('index', 'example', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'is_user_logged_in' => is_user_logged_in()
    ));
}


add_action('acf/init', function () {
    if (function_exists('acf_add_local_field_group')):
        acf_add_local_field_group(array(
            'key' => 'group_5c18f89ca825f',
            'title' => 'repeater',
            'fields' => array(
                array(
                    'key' => 'field_5c18f8a29941c',
                    'label' => 'Ads',
                    'name' => 'ads_list',
                    'type' => 'repeater',
                    'wrapper' => array(
                        'width' => '',
                    ),
                    'collapsed' => '',
                    'min' => 0,
                    'layout' => 'table',
                    'button_label' => 'Add item',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_5c18f8ba9941d',
                            'label' => 'Ad key',
                            'name' => 'ad_key',
                            'type' => 'text',
                            'wrapper' => array(
                                'width' => '25',
                            ),
                            'default_value' => '',
                        ),
                        array(
                            'key' => 'field_5c18f8ba9231f',
                            'label' => 'Ad script',
                            'name' => 'ad_script',
                            'type' => 'textarea',
                            'wrapper' => array(
                                'width' => '75',
                            ),
                            'rows' => 3,
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'options_page',
                        'operator' => '==',
                        'value' => 'theme-general-settings'
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
            'active' => 1,
            'description' => '',
        ));
    endif;
});


// Theme options
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Theme General Settings',
        'menu_title' => 'Theme Settings',
        'menu_slug' => 'theme-general-settings',
        'capability' => 'edit_posts',
        'redirect' => false
    ));
}


add_action('wp_ajax_ads_ajax', 'ads_ajax');
add_action('wp_ajax_nopriv_ads_ajax', 'ads_ajax');
function ads_ajax()
{
    $post_url = $_POST['post_url'];
    $post_id = parse_url($post_url);
    parse_str($post_id['query'], $query);
    $ads = $_POST['ads'];


    $currentAdsList = get_field('ads_list', 'options');

    //1
    $option = get_option('global_ads_list', []);

    //2
    $filter = array_filter($option, function ($item) use ($query) {
        return intval($item['postId']) !== intval($query['post']);
    });

    //3
    array_push($filter, [
        'postId' => $query['post'],
        'postState' => $ads,
    ]);

    //4
    update_option('global_ads_list', $filter);

//    echo $query['post'];
//    var_dump($ads);

    var_dump($filter);
    die();
}

add_action('enqueue_block_editor_assets', 'styles_scripts_enqueue_assets');
remove_filter('the_content', 'wptexturize');


//$option = get_option('global_ads_list', []);
//var_dump($option);
//
//add_action( 'wp_footer', function() {
//    var_dump( get_field( 'ads_list', 'options' ) );
//} );
//update_filed('ads_list', $option, 'options');


//function adsItem( $postId, $index, $tag ) {
//    $key = $postId . '_' . $index;
//    return [
//        array(
//            'key' => 'tag_' . $key,
//            'message' => $tag,
//            'default_value' => '',
//            'label' => 'Ad key',
//            'name' => 'ad_key',
//            'type' => 'message',
//            'wrapper' => array(
//                'width' => '25',
//            ),
//        ),
//        array(
//            'key' => 'script_' . $key,
//            'label' => 'Ad script',
//            'name' => 'ad_script',
//            'type' => 'textarea',
//            'wrapper' => array(
//                'width' => '75',
//            ),
//            'rows' => 3,
//        ),
//    ];
//}
//$subFields = [];
//foreach ( [ [ 14, 0, 'sport'], [ 18, 0, 'test' ] ] as $filed ) {
//    array_push( $subFields, adsItem( $filed[0], $filed[1], $filed[2] ) );
//}
//var_dump( $subFields );


//function my_acf_add_local_field_groups()
//{
//    if (function_exists('acf_add_local_field_group')):
//
//        acf_add_local_field_group(array(
//            'key' => 'group_60942cfc4fb5f',
//            'title' => 'Ads list',
//            'fields' => array(
//                array(
//                    'key' => 'field_60942d04a533e',
//                    'label' => 'Ads list',
//                    'name' => 'ads_list_test',
//                    'type' => 'repeater',
//                    'instructions' => '',
//                    'required' => 0,
//                    'conditional_logic' => 0,
//                    'wrapper' => array(
//                        'width' => '',
//                        'class' => '',
//                        'id' => '',
//                    ),
//                    'collapsed' => '',
//                    'min' => 0,
//                    'max' => 0,
//                    'layout' => 'table',
//                    'button_label' => '',
//                    'sub_fields' => array(
//                        array(
//                            'key' => 'field_60942d11a533f',
//                            'label' => 'tag',
//                            'name' => 'tag',
//                            'type' => 'text',
//                            'instructions' => '',
//                            'required' => 0,
//                            'conditional_logic' => 0,
//                            'wrapper' => array(
//                                'width' => '',
//                                'class' => '',
//                                'id' => '',
//                            ),
//                            'default_value' => '',
//                            'placeholder' => '',
//                            'prepend' => '',
//                            'append' => '',
//                            'maxlength' => '',
//                        ),
//                        array(
//                            'key' => 'field_60942d18a5340',
//                            'label' => 'ad',
//                            'name' => 'ad',
//                            'type' => 'textarea',
//                            'instructions' => '',
//                            'required' => 0,
//                            'conditional_logic' => 0,
//                            'wrapper' => array(
//                                'width' => '',
//                                'class' => '',
//                                'id' => '',
//                            ),
//                            'default_value' => '',
//                            'placeholder' => '',
//                            'maxlength' => '',
//                            'rows' => 3,
//                            'new_lines' => '',
//                        ),
//                    ),
//                ),
//            ),
//            'location' => array(
//                array(
//                    array(
//                        'param' => 'options_page',
//                        'operator' => '==',
//                        'value' => 'theme-general-settings',
//                    ),
//                ),
//            ),
//            'menu_order' => 0,
//            'position' => 'normal',
//            'style' => 'default',
//            'label_placement' => 'top',
//            'instruction_placement' => 'label',
//            'hide_on_screen' => '',
//            'active' => true,
//            'description' => '',
//        ));
//
//    endif;
//}

//add_action('acf/init', 'my_acf_add_local_field_groups');


//$test = get_field('ads_list', 'option');
//
//echo '<pre>';
//var_dump($test);
//echo '</pre>';


$ref = [
    [
        'postId' => 14,
        'postState' => [
            [
                'desktop' => 'tag',
                'tablet' => 'tag',
                'mobile' => 'tag',
            ],
            [
                'desktop' => 'tag',
                'tablet' => 'tag',
                'mobile' => 'tag',
            ]
        ],
    ],
    [
        'postId' => 140,
        'postState' => [
            [
                'index' => 1,
                'blockState' => [
                    'desktop' => 'tag',
                    'tablet' => 'tag',
                    'mobile' => 'tag',
                ]
            ],
            [
                'index' => 1,
                'blockState' => [
                    [
                        'desktop' => 'tag',
                        'tablet' => 'news',
                        'mobile' => 'sport',
                    ]
                ]
            ],
        ],
    ],
];

update_option('global_ads_list', $ref);


$merge = [
    'desk' => [
        'tag' => '<script></script>',
        'news' => '',
        'sport' => '',
    ],
    'tablet' => [],
    'mobile' => [],
];


function filterList()
{

    $option = get_option('global_ads_list', []);
    $devices = [];
    foreach ($option as $key => $item) {
        foreach ($item['postState'][$key] as $sub) {
            echo '<pre>';
            var_dump($sub);
            echo '</pre>';
        };
    }
}

//filterList();

//echo '<pre>';
//var_dump(get_option('global_ads_list', []));
//echo '</pre>';


//
//
//function collectUniqueTags()
//{
//    $refUniqueTags = [];
//    foreach ( $ref as $ )
//    return $refUniqueTags;
//}
//
//function addTagsPost($postId)
//{
//    $ref = [];
//    $filter = [];
//    array_push($postState, $filter);
//    $ref = $filter;
//}


//acf_add_local_field_group(array(
//    'key' => 'group_5c18f89ca825f',
//    'title' => 'repeater',
//    'fields' => array(
//        array(
//            'key' => 'field_5c18f8a29941c',
//            'label' => 'Ads',
//            'name' => 'ads_list',
//            'type' => 'repeater',
//                'instructions' => '',
//                'required' => 0,
//                'conditional_logic' => 0,
//            'wrapper' => array(
//                'width' => '',
//                    'class' => '',
//                    'id' => '',
//            ),
//            'collapsed' => '',
//            'min' => 0,
//                'max' => 0,
//            'layout' => 'table',
//            'button_label' => 'Add item',
//            'sub_fields' => array(
//                array(
//                    'key' => 'field_5c18f8ba9941d',
//                    'label' => 'Ad key',
//                    'name' => 'ad_key',
//                    'type' => 'text',
//                            'message' => 'esgfes',
//                            'instructions' => 'test',
//                        'required' => 0,
//                        'conditional_logic' => 0,
//                    'wrapper' => array(
//                        'width' => '25',
//                            'class' => '',
//                            'id' => '',
//                    ),
//                    'default_value' => '',
//                        'placeholder' => '',
//                        'prepend' => '',
//                        'append' => '',
//                        'maxlength' => '',
//                ),
//                array(
//                    'key' => 'field_5c18f8ba9231f',
//                    'label' => 'Ad script',
//                    'name' => 'ad_script',
//                    'type' => 'textarea',
//                        'required' => 0,
//                        'instructions' => '',
//                        'conditional_logic' => 0,
//                    'wrapper' => array(
//                        'width' => '75',
//                            'class' => '',
//                            'id' => '',
//                    ),
//                        'default_value' => '',
//                        'placeholder' => '',
//                    'rows' => 3,
//                        'prepend' => '',
//                        'append' => '',
//                        'maxlength' => '',
//                ),
//            ),
//        ),
//    ),
//    'location' => array(
//        array(
//            array(
//                'param' => 'options_page',
//                'operator' => '==',
//                'value' => 'theme-general-settings'
//            ),
//        ),
//    ),
//    'menu_order' => 0,
//    'position' => 'normal',
//    'style' => 'default',
//    'label_placement' => 'top',
//    'instruction_placement' => 'label',
//    'hide_on_screen' => '',
//    'active' => 1,
//    'description' => '',
//));
//endif;