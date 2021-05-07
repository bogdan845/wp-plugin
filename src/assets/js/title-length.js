window._wpLoadBlockEditor.then(function () {
    const {select, subscribe, dispatch} = wp.data;
    let locked = false;
    subscribe(() => {
        const postTitle = select('core/editor').getEditedPostAttribute('title');
        if (postTitle && postTitle.length >= 86) {
            if (!locked) {
                locked = true;
                dispatch('core/editor').lockPostSaving('title-lock');
                dispatch('core/notices').createNotice(
                    'error',
                    'Title length exceeded. Please, make title shorter',
                    {id: 'title-lock', isDismissible: false}
                );
            }
        } else if (locked) {
            locked = false;
            dispatch('core/editor').unlockPostSaving('title-lock');
            dispatch('core/notices').removeNotice('title-lock');
        }
    });
});