let $grid = null;

const deleteImg = function(e) {
    const container = e.parentElement.parentElement;

    if($grid) {
        // TODO try to delete from db

        // While response from db, show loading overlay?

        // if successful delete from db
        $grid.masonry('remove', container).masonry();

        // if NOT successful
        // alert('Could not delete ');
    }
};

const editImg = function(e) {
    const container = e.parentElement.parentElement;
    const img = container.getElementsByTagName("img")[0];
    const imgObj = {
        time: img.time || Date.now(),
        original: img.original || 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg',
        edited: img.edited || '',
        topText: img.topText || 'Top Text',
        topSize: img.topSize || 40,
        bottomText: img.bottomText || 'Bottom Tet',
        bottomSize: img.bottomSize || 40,
        tags: img.tags || []
    };

    localStorage.setItem('currentImg', JSON.stringify(imgObj));
    window.location.assign('/create.html');
};

document.addEventListener('DOMContentLoaded', function() {

    /*** Masonry ***/
    $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 4,
        horizontalOrder: true
    });
    /*** Firebase ***/


    /*** Library stuff ***/

});