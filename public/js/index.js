const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();
let $grid = null;

const deleteImg = function(imgBtn) {
    const imgContainer = imgBtn.parentElement.parentElement;
    const img = imgContainer.getElementsByTagName('img')[0];

    if($grid) {
        // While response from db, show loading overlay?
        // if successful delete from db
        console.log(img);
        console.log(img.memeId);
        try {
            db.ref(`/users/${auth.currentUser.uid}/memes/${img.memeId}`).remove();
            $grid.isotope('remove', imgContainer).isotope('layout');
        } catch(e) {
            alert('Could not delete');
        }
    }
};

const editImg = function(e) {
    const container = e.parentElement.parentElement;
    const img = container.getElementsByTagName("img")[0];

    const imgObj = {
        time: img.time,
        original: img.original,
        edited: img.edited,
        topText: img.topText,
        topSize: img.topSize,
        bottomText: img.bottomText,
        bottomSize: img.bottomSize,
        tags: img.tags
    };

    localStorage.setItem('currentImg', JSON.stringify(imgObj));
    window.location.assign('/create.html');
};

const goToCreate = function() {
    console.log('test');
    localStorage.removeItem('currentImg');
    window.location.assign('/create.html');
};

document.addEventListener('DOMContentLoaded', function() {
    /*** Masonry ***/
    $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
            columnWidth: '.grid-sizer',
            horizontalOrder: true,
            gutter: 4
        },
        getSortData: {
            name: '.name',
            time: '.time parseInt'
        }
    });

    /*** Function Definitions ***/
    function addMemeToGrid(memeId, memeProps, imgUrl) {
        const gridItem = $(`<div class="grid-item">
                                <div class="grid-item-overlay">
                                    <button onclick="deleteImg(this);">Delete</button>
                                    <button>Share</button>
                                    <button onclick="editImg(this);">Edit</button>
                                </div>
                                <img class="grid-item-image" src="${imgUrl}" alt="">
                                <span class="time" hidden>${memeProps.time}</span>
                                <span class="name" hidden>${memeProps.topText}</span>
                            </div>`);

        const currentImg = gridItem.find('img')[0];

        currentImg.memeId = memeId;
        currentImg.time = memeProps.time;
        currentImg.original = memeProps.original;
        currentImg.edited = imgUrl;
        currentImg.topText = memeProps.topText;
        currentImg.topSize = memeProps.topSize;
        currentImg.bottomText = memeProps.bottomText;
        currentImg.bottomSize = memeProps.bottomSize;
        currentImg.tags = memeProps.tags;

        $grid.isotope('insert', gridItem);
    }

    function getUserMemesFromDB() {
        if(auth.currentUser) {
            console.log(`/users/${auth.currentUser.uid}/`);
            db.ref(`/users/${auth.currentUser.uid}/memes`).once('value', function(res) {
                const memes = res.val();

                if(memes) {
                    Object.keys(memes).forEach(function(memeId) {
                        const memeProps = memes[memeId];
                        storage.refFromURL(memeProps.edited).getDownloadURL().then(function(url){
                            addMemeToGrid(memeId, memeProps, url);
                        }).catch(function(err) {
                            console.log('Image does not exist');
                            console.log(err);
                        });
                    });
                }
            });
        }
    }

    /*** Initializers ***/
    auth.onAuthStateChanged(function(user) {
        if(user) {
            getUserMemesFromDB();
        } else {
            window.location.assign('auth.html');
        }
    });

    /*** Event Handlers ***/
    document.getElementById('date-radio').onclick = function() {
        $grid.isotope({sortBy: 'time'});
    };

    document.getElementById('name-radio').onclick = function() {
        $grid.isotope({sortBy: 'name'});
    };

});


