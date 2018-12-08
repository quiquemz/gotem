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

function populate_DOM(user, db, us)
{
  //get the templates
  const templates = document.querySelector("#templates");
  const grid_item_template = templates.querySelector('#grid-item-template');

  //pull from the database
  db.collection("users").doc(user.uid).get().then(function(querySnapshot) {
    for(let meme in querySnapshot.data()){

      const path = querySnapshot.data()[meme].path;
      console.log(path);

      let next_grid_item = document.querySelector(".grid").firstElementChild;
      next_grid_item.innerHTML = "first";
      next_grid_item.nextElementSibling = document.createTextNode('sibling');
      next_grid_item.nextElementSibling = document.createTextNode('sibling');
      next_grid_item = next_grid_item.nextSibling;
      //go to the end of the list
      while(next_grid_item.nextElementSibling)
      {
        next_grid_item = next_grid_item.nextElementSibling;
      }


      // Create a reference with an initial file path and name
      try{

        // Create a reference from a Google Cloud Storage URI
        const gsReference = us.ref(path);

        gsReference.getDownloadURL().then(function(url) {// `url` is the download URL for the user's image

          //strip out the movie-item element from the template
          const grid_item = document.importNode(grid_item_template.content, true);

          //insert into the <img> element:
          grid_item.querySelector('.grid-item-image').src = url;

          //add the item to the list 
          next_grid_item.nextElementSibling = grid_item;
          next_grid_item = next_grid_item.nextSibling;

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
        console.error(err);
      }
    }
  });
}
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
