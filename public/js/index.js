let msnry = null;

const deleteImg = function(e) {
    const container = e.parentElement.parentElement;

    if(msnry) {
        container.parentElement.removeChild(container);
        msnry.layout();
    }
};

document.addEventListener('DOMContentLoaded', function() {

    /*** Masonry ***/
    const grid = document.querySelector('.grid');
    msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 4,
        horizontalOrder: true
    });

    /*** Firebase ***/


    /*** Library stuff ***/


});