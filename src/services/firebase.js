import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyDWBVqbz6vL6NdeIej0HccjA1PaDJ04jpI",
    authDomain: "stockviewer-2c7c3.firebaseapp.com",
    databaseURL: "https://stockviewer-2c7c3.firebaseio.com",
    projectId: "stockviewer-2c7c3",
    storageBucket: "stockviewer-2c7c3.appspot.com",
    messagingSenderId: "220017451421",
    appId: "1:220017451421:web:0ccfacdb66182b06e98f74",
    measurementId: "G-ET4VWCH7VY"
}

firebase.initializeApp(config);
export const auth = firebase.auth;
export const realTime = firebase.database();
export const db = firebase.firestore();

