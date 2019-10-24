import * as functions from 'firebase-functions';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyDk6Vn6L_EmCIFxoGxN2l58PcCtlkaP0kQ",
    authDomain: "guardianthreepointo.firebaseapp.com",
    databaseURL: "https://guardianthreepointo.firebaseio.com",
    projectId: "guardianthreepointo",
    storageBucket: "guardianthreepointo.appspot.com",
    messagingSenderId: "82925382824",
    appId: "1:82925382824:web:7fb76f4ed993bdc7"
};
admin.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//     console.log("test")
//     response.send("test from Firebase!");
// });

export const createPlayer = functions.https.onRequest((request, response) => {
    let email = request.query.email;
    let password = request.query.password;
    let username = request.query.username;
    response.header('Content-Type','application/json');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log(email);
    console.log(password);
    console.log(username);

    firebase.auth().createUserWithEmailAndPassword(email,password).then(
        res => {
            //response.send(res);
            let userId = res.user && res.user.uid;
            let ref = admin.database().ref(`user/${userId}`);
            ref.set({
                username: username,
                point: 0,
                userType: "player"
            }).then(res => {
                response.send(res)
            },
            err=>{
                response.send(err)
            })
        },
        err => {
            response.send(err);
        }
    )
    //response.send("test from Firebase!" + email + password);
    
});

