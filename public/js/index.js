let msnry = null;

function applyMsnry(msnry){
  if(msnry){
    msnry.layout();
    console.log('msnry applying');
  }else{
    console.log('msnry not ready to apply');
  }
}

function probe(thing,x)
{
  let tabs = '';
  if(x > 0)
  {
    tabs = '\t';
  }
  else
  {
    console.log('probing '+thing.toString());
  }
  for(const i of Array(x).keys())
  {
    tabs += tabs;
  }
  for(t in thing)
  {
    console.log(tabs+t+': '+thing[t]);
    if(thing[t] != null && thing[t].length > 1)
    {
      probe(thing[t], x+1);
    }
  }
}

function draw_on_grid(grid, meme_data, us)
{
  console.log(grid.name);
  const grid_item_template = document.querySelector('#grid-item-template');

  console.log(meme_data);
  const path = 'images/'+meme_data.id;
  console.log(path);

  // Create a reference with an initial file path and name
  try
  {
    // Create a reference from a Google Cloud Storage URI
    const gsReference = us.ref(path);

    gsReference.getDownloadURL().then(function(url) 
      {
        //strip out the movie-item element from the template
        const grid_item = document.importNode(grid_item_template.content, true);

        //insert into the <img> element:
        grid_item.querySelector('.grid-item-image').src = url;

        //add the item to the list 
        grid.appendChild(grid_item);
        msnry.appended(grid_item);
      }).catch(function(error) 
        {
          // Handle any errors
          console.error(error.message);
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
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
  catch(err)
  {
    console.error(err.message);
  }
}

function populate_DOM(grid, user, db, us)
{
  console.log(grid.name);
  //get the templates
  const templates = document.querySelector("#templates");
  const grid_item_template = templates.querySelector('#grid-item-template');

  //the main collection of memes
  const user_memes = db.collection("users").doc(user.uid).collection("memes");

  //pull the references from the database
  user_memes.get().then(function(QuerySnapshot) 
    {
      //pull iterate through each meme collection 
      for(let i = 0; i < QuerySnapshot.size; i++)
      {
        let current_meme = QuerySnapshot.docs[i];
        user_memes.doc(current_meme.id).get().then(function(meme)
          {
            //this is the meme
            meme_data = meme.data();
            console.log(meme_data);
            if(meme_data.edited != null)//use the edited url by default
            {
              draw_on_grid(grid, meme_data.edited,us);
            }
            else if(meme_data.original != null)//use the original photo as backup
            {
              draw_on_grid(grid, meme_data.original,us);
            }
            else//this should never happen
            {
              console.error('database contained no links to images');
            }
          });

        /*for testing purposes*/
        msnry.layout();
        break;
      }
    });
}

const deleteImg = function(e) 
{
  const container = e.parentElement.parentElement;

  if(msnry) 
  {
    container.parentElement.removeChild(container);
    msnry.layout();
  }
};

const editImg = function(e) 
{
  const container = e.parentElement.parentElement;
  const img = container.getElementsByTagName("img")[0];
  const imgObj = 
    {
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

document.addEventListener('DOMContentLoaded', function() 
  {
    console.log('triggered');
    /*** Masonry ***/
    const grid = document.querySelector('.grid');
    grid.name = "something coool";

    msnry = new Masonry(grid, 
      {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 4,
        horizontalOrder: true
      });

    /*** Firebase ***/
    firebase.auth().onAuthStateChanged(function(user) 
      {
        if (user) 
        {
          console.log(user.toJSON());
          const us = firebase.storage();
          const db = firebase.firestore();
          // Initialize Cloud Firestore through Firebase
          // Disable deprecated features
          db.settings(
            {
              timestampsInSnapshots: true
            });

          populate_DOM(grid, user, db, us);
        }
        else
        {
          window.location.assign('/auth.html');
        }
      });

    /*** Library stuff ***/
    /*
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
    */

  });
