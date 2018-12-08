let msnry = null;

const grid_item_template = document.querySelector('#grid-item-template');
const grid = document.querySelector(".grid");


function probe(thing,x){
  let tabs = '';
  if(x > 0){
    tabs = '\t';
  }else{
    console.log('probing '+thing.toString());
  }
  for(const i of Array(x).keys()){
    tabs += tabs;
  }
  for(t in thing){
    console.log(tabs+t+': '+thing[t]);
    if(thing[t] != null && thing[t].length > 1){
      probe(thing[t], x+1);
    }
  }
}

function draw_on_grid(meme_data, us){
  console.log(meme_data);
  const path = 'images/'+meme_data.id;
  console.log(path);

  // Create a reference with an initial file path and name
  try{

    // Create a reference from a Google Cloud Storage URI
    const gsReference = us.ref(path);

    gsReference.getDownloadURL().then(function(url) {

      console.log(url);

      //strip out the movie-item element from the template
      const grid_item = document.importNode(grid_item_template.content, true);

      //insert into the <img> element:
      grid_item.querySelector('.grid-item-image').src = url;

      //add the item to the list 
      grid.appendChild(grid_item);

    }).catch(function(error) {
      // Handle any errors
      console.error(error.message);
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
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
  catch(err){
    console.error(err.message);
  }
}

function populate_DOM(user, db, us)
{
  //get the templates
  const templates = document.querySelector("#templates");
  const grid_item_template = templates.querySelector('#grid-item-template');

  //pull from the database
  const user_memes = db.collection("users").doc(user.uid).collection("memes");

  user_memes.get().then(function(documentSnapshot) {
    documentSnapshot.forEach(function(meme_item){
      user_memes.doc(meme_item.id).get().then(function(meme){
        meme_data = meme.data();
        if(meme_data.edited != null){
          draw_on_grid(meme_data.edited,us);
        }else if(meme_data.original != null){
          draw_on_grid(meme_data.original,us);
        }else{
          console.error('database contained no links to images');
        }
      });
    });

  });
  console.log(msnry);
  msnry.layout();
}

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
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.toJSON());
      const us = firebase.storage();
      const db = firebase.firestore();
      // Initialize Cloud Firestore through Firebase
      // Disable deprecated features
      db.settings({
        timestampsInSnapshots: true
      });

      populate_DOM(user, db, us);
    }else{
      window.location.assign('/auth.html');
    }
  });

  /*** Library stuff ***/


});
