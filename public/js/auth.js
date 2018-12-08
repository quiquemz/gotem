const authForm = document.forms['authForm'];
const error_message = authForm.querySelector('#error-message');
let attempted_login = false;

window.onload = signout;

firebase.auth().onAuthStateChanged(function(user) {
  if (user && attempted_login) {
    window.location.assign("/")
  }else if(user){
    console.log('login not yet attempted');
  }
});

function signout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
      console.log('user signed out');
  }).catch(function(error) {
    // An error happened.
      console.error(error.message);
  });
}

function authorization()
{
  error_message.innerHTML = "";
  for(let e in authForm.elements)
  {
    const elem = authForm.elements[e];
    switch(elem.name){
      case 'signup':
        if(elem.value == elem.name){
          attempted_login = true;
          attempt_signup();
        }
        elem.value="";
        break;
      case 'login':
        if(elem.value == elem.name){
          attempted_login = true;
          attempt_login();
        }
        elem.value="";
        break;
    }
  }
}

function attempt_signup()
{
  let email = authForm.querySelector("#email").value;
  let password = authForm.querySelector("#password").value;
  console.log('attempting signup for email={'+email+'} and password={'+password+'}');
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    console.error(error.toString());
    error_message.innerHTML = error.message;
    attempted_login = false;
  });
}

function attempt_login()
{
  let email = authForm.querySelector("#email").value;
  let password = authForm.querySelector("#password").value;
  console.log('attempting login for email={'+email+'} and password={'+password+'}');
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function(error) {
      console.error(error.code+": "+error.toString());
      error_message.innerHTML = error.message;
      attempted_login = false;
    });
  if(firebase.auth().currentUser){
    if(firebase.auth().currentUser.email == email){
      window.location.assign("/");
    }
  }
}

