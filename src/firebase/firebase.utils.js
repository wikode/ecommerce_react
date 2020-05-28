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

export const createUserProfilDocument = async (userAuth, additionalData) => {
    // connexion avec google renvoie un objet userAuth
    if (!userAuth) return;
    // s'il y a bien cet objet renvoyé alors on vérifie si un user existe déjà dans la database avec le uid du user, et on stocke les infos du document dans snapShot
    const userRef = firestore.doc(`users/${userAuth.uid}`)
    const snapShot = await userRef.get()
    // cet objet snapShot possède une propriété exists booléenne on vérifie, si existe pas alors on créer un nouveau doc dans database avec les infos de l'objet userAuth + d'autres infos optionnelles qu'on peut passer en 2nd paramètre de la fonction createUserProfilDocument
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message)
        }
    }

    // on retourne l'objet userRef au cas où on veut en faire autre chose
    return userRef;
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Mettre en place la connexion avec google :
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;