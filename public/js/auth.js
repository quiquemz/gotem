document.addEventListener('DOMContentLoaded', function () {
    /*** Firebase Auth and DB ***/
    const auth = firebase.auth();
    const db = firebase.database();

    const authForm = document.forms['authForm'];
    const error_message = authForm.querySelector('#error-message');

    /*** Function definitions ***/
    function writeUserDataDB(uid, email) {
        console.log();
        db.ref('users/' + uid).once('value', function(snapshot) {
            if(snapshot.exists()) {
                console.log('exists');
            } else {
                console.log('not exists');
                db.ref('users/' + uid).set({
                    email: email,
                    memes: {
                        example: {
                            bottomSize: 40,
                            bottomText: 'Bottom',
                            original: 'gs:/gotem-memes-243ad.appspot.com/images/cheese.jpg',
                            tags: [],
                            time: Date.now(),
                            topSize: 30,
                            topText: 'Top'
                        }
                    }
                });
            }
        });

    }

    function signout(){
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log('user signed out');
        }).catch(function(error) {
            // An error happened.
            console.error(error.message);
        });
    }

    function authorization() {
        error_message.innerHTML = "";
        for(let e in authForm.elements) {
            const elem = authForm.elements[e];
            switch(elem.name){
                case 'signup':
                    if(elem.value === elem.name) {
                        attempted_login = true;
                        attempt_signup();
                    }
                    elem.value="";
                    break;
                case 'login':
                    if(elem.value === elem.name) {
                        attempted_login = true;
                        attempt_login();
                    }
                    elem.value="";
                    break;
            }
        }
    }

    function attempt_signup() {
        let email = authForm.querySelector("#email").value;
        let password = authForm.querySelector("#password").value;

        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
            console.warn(error.toString());
            error_message.innerHTML = error.message;
            attempted_login = false;
        });
    }

    function attempt_login() {
        let email = authForm.querySelector("#email").value;
        let password = authForm.querySelector("#password").value;

        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                return auth.signInWithEmailAndPassword(email, password);
            })
            .catch(function(error) {
                console.error(error.code+": "+error.toString());
                error_message.innerHTML = error.message;
                attempted_login = false;
            });
        if(auth.currentUser){
            if(auth.currentUser.email === email){
                window.location.assign("/");
            }
        }
    }

    /* Initializers */
    signout();

    /* Event Handlers */
    auth.onAuthStateChanged(function(user) {
        if (user && attempted_login) {
            window.location.assign("/");
            console.log(user.uid);

            writeUserDataDB(user.uid, user.email);
        } else if(user){
            console.log('login not yet attempted');
        }
    });

    authForm.onsubmit = function(e) {
        e.preventDefault();
        authorization();
    }

});



