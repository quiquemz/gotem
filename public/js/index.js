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
  /*** End Masonry ***/

  /*** Library stuff ***/
  document.getElementById('date-radio').onclick = function() {
    $grid.isotope({sortBy: 'time'});
  };

  document.getElementById('name-radio').onclick = function() {
    $grid.isotope({sortBy: 'name'});
  };
  /*** End Library stuff ***/

  /*** Firebase ***/
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      //populate their library with memes from their collection
      const storage = firebase.storage();
      const database = firebase.firestore();
      database.settings({timestampsInSnapshots: true});
      populateLibrary(user, storage, database);
    }else{
      //redirect the user to login
      window.location.assign('auth.html')
    }
  });
  /*** End Firebase ***/
});

function addMemeToMasonry(storage, isEdited, memeData){
  const grid_item_template = document.querySelector('#grid-item-template');

  let memePath = memeData.original;
  if(isEdited){
    memePath = memeData.edited; 
  }
  //get the meme's storage path
  console.log(memePath);
  const path = 'images/'+memePath.id;
  console.log(path);


  //get a reference to it in storage
  const gsReference = storage.ref(path);

  gsReference.getDownloadURL().then(function(url){
    //strip out the movie-item element from the template
    const grid_item = document.importNode(grid_item_template.content, true);

    //create the <img>
    const img = grid_item.querySelector('.grid-item-image');

    //fields for createjs to work 
    img.src = url;
    img.alt = memePath.id;
    img.time = memeData.time;
    img.original = !isEdited ? url : "";
    img.edited = isEdited ? url : ""; 
    img.topText = memeData.topText ? memeData.topText : "";
    img.topSize = memeData.topSize ? memeData.topSize : "";
    img.bottomText = memeData.bottomText ? memeData.bottomText : "";
    img.bottomSize = memeData.bottomSize ? memeData.bottomSize : "";
    img.tags = memeData.tags ? memeData.tags : "";

    //for the filters to work 
    grid_item.querySelector('.time').innerHTML = memeData.time;
    grid_item.querySelector('.name').innerHTML = memePath.id;

    console.log(img);

    //append to the masonry
    $grid.isotope('insert', grid_item).isotope('reloadItems').isotope('layout');

  }).catch(function(error){
    console.error(error.message);
    // Handle any errors
    switch (error.code) 
    {
      case 'storage/object-not-found':
        //add the item to the list 
        // File doesn't exist
        break;

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
}

function populateLibrary(user, storage, database){
  //the main collection of memes
  const userMemes = database.collection("users")
    .doc(user.uid)
    .collection("memes");

  //pull the references from the database
  userMemes.get().then(function(memeCollection) 
    {
      //pull iterate through the meme collection 
      for(let i = 0; i < memeCollection.size; i++)
      {
        let currentMeme = memeCollection.docs[i];

        //get the data for the current meme
        userMemes.doc(currentMeme.id).get().then(function(meme)
          {
            //this is the meme
            memeData = meme.data();
            let timestamp = null;
            if(memeData.time == null){
              const time = firebase.firestore.FieldValue.serverTimestamp();
              timestamp = {
                timestamp: time
              }
              console.log(timestamp);
              userMemes.doc(currentMeme.id).set(timestamp).then(function(){
                  console.log('added new timestamp to meme');
                }).then(function(error){
                  if(error){
                    console.error(error.message);
                  }
                });
            }

            console.log(memeData);
            if(memeData.edited != null)//use the edited url by default
            {
              addMemeToMasonry(storage, true, memeData);
            }
            else if(memeData.original != null)//use the original photo as backup
            {
              addMemeToMasonry(storage, false, memeData);
            }
            else//this should never happen
            {
              console.error('database contained no links to images');
            }
          });
      }
    });
}
