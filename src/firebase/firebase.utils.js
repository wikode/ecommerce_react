import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBrd5upEJEgqGj80pg9cmPuEM5iRQlcWQM",
    authDomain: "crwn-db-7df14.firebaseapp.com",
    databaseURL: "https://crwn-db-7df14.firebaseio.com",
    projectId: "crwn-db-7df14",
    storageBucket: "crwn-db-7df14.appspot.com",
    messagingSenderId: "2519245878",
    appId: "1:2519245878:web:77e2185c8e005d5d73e497",
    measurementId: "G-0SZCB408R5"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;