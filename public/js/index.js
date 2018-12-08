let msnry = null;

const deleteImg = function(e) {
    const container = e.parentElement.parentElement;

    if(msnry) {
        // TODO try to delete from db

        // While response from db, show loading overlay?

        // if successful delete from db
        container.parentElement.removeChild(container);
        msnry.layout();

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
    const grid = document.querySelector('.grid');

    msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 4,
        horizontalOrder: true
    });
    msnry.layout();

    /*** Firebase ***/


    /*** Library stuff ***/
    //TODO delete imgToRemove stuff
    const imgToRemove = document.getElementById('img-to-remove');

    imgToRemove.time = Date.now();
    imgToRemove.original = imgToRemove.src;
    imgToRemove.edited = imgToRemove.src;
    imgToRemove.topText = "the face you make";
    imgToRemove.topSize = 30;
    imgToRemove.bottomText = "when you fall on a hole";
    imgToRemove.bottomSize = 30;
    imgToRemove.tags = ["fun", "english", "random"];

});