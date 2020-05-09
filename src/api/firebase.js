import * as firebase from "firebase";

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
firebase.analytics()

export default firebase.firestore()
