function populate_DOM(db, us)
{
  db.collection("users").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      console.log(doc.id, " => ", doc.data());
      const data = doc.data();
      for(let item in data){
        console.log(item+": "+data[item]);
        const itemizer = data[item];
        for(let thing in itemizer[0]){
          console.log(thing+": "+itemizer);
        }

        item.path;
        const templates = document.querySelector("#templates");
        let next_grid_item = document.querySelector(".grid").firstChild;

        //go to the end of the list
        while(next_grid_item.nextElementSibling)
        {
          next_grid_item = next_grid_item.nextElementSibling;
        }

        //pull from the database
        if(true == false){

          for(let image_db in null){
            const image_path_gs = db.collection("users").doc(image_db);
            for(let thing in image_path_gs){
              console.log(thing+": "+image_path_gs[thing]);
            }

            // Create a reference with an initial file path and name
            try{

              // Create a reference from a Google Cloud Storage URI
              const gsReference = us.ref(image_path_gs.path);

              gsReference.getDownloadURL().then(function(url) {// `url` is the download URL for the user's image

                //get the template
                const grid_item_template = templates.querySelector('#grid-item-template');

                //strip out the movie-item element from the template
                const grid_item = document.importNode(grid_item_template.content, true);

                //insert into the <img> element:
                grid_item.querySelector('.grid-item-image').src = "{doc.data()}";

                //add the item to the list 
                next_grid_item.nextElementSibling = grid_item;
                next_grid_item = next_grid_item.nextSibling;

              }).catch(function(error) {
                // Handle any errors
                console.error(error.toString());
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/object-not-found':
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
          alert('You need to login to view your library');
        }
      }
    });
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
