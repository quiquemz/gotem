// Initialize Firebase
const config = {
  apiKey: "AIzaSyCqA1IGa5n5MR5rHSSUs1w4mw-KXp8NS2s\n",
  authDomain: "gotem-memes-243ad.firebaseapp.com",
  databaseURL: "https://gotem-memes-243ad.firebaseio.com",
  projectId: "gotem-memes-243ad",
  storageBucket: "gs://gotem-memes-243ad.appspot.com",
};

firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();
var imagesRef = storageRef.child('images/zippy_meme_logo.png');

imagesRef.getDownloadURL().then(function(url) {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
        var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element:
    var img = document.getElementById('myimg');
    img.src = url;
}).catch(function(error) {
    // Handle any errors
});
