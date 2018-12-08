let $grid = null;

const deleteImg = function(e) {
  const container = e.parentElement.parentElement;

  if($grid) {
    // TODO try to delete from db

    // While response from db, show loading overlay?
      // if successful delete from db
      $grid.isotope('remove', container).isotope('layout');

    // if NOT successful
    // alert('Could not delete ');
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

    /*** Library stuff ***/
    document.getElementById('date-radio').onclick = function() {
        $grid.isotope({sortBy: 'time'});
    };

    document.getElementById('name-radio').onclick = function() {
        $grid.isotope({sortBy: 'name'});
    };

  /*** Firebase ***/
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      //populate their library with memes from their collection
      const storage = firebase.storage();
      const database = firebase.firestore();
      /*populateLibrary(user, storage, database);*/
    }else{
      //redirect the user to login
      window.location.assign('auth.html')
    }
  });
  /*** End Firebase ***/

  /*** Library stuff ***/
});
