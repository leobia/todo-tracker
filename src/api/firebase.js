import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/database';
import 'firebase/app';

var firebaseConfig = {
    apiKey: "AIzaSyDhi4CRK9B172dqzIOgUmztRfX0GkOFu8E",
    authDomain: "leobia-tomado.firebaseapp.com",
    databaseURL: "https://leobia-tomado.firebaseio.com",
    projectId: "leobia-tomado",
    storageBucket: "leobia-tomado.appspot.com",
    messagingSenderId: "345322377735",
    appId: "1:345322377735:web:ca49c4169c00b2923d90a2",
    measurementId: "G-SCJN9G7PBQ"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const analytics = firebase.analytics()
const auth = firebase.auth()

export default {
    db,
    analytics,
    auth,
    firestore: firebase.firestore
}
