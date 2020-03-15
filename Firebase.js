import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage
import 'firebase/auth';  // If using Firebase storageBucket
import 'firebase/firestore';  // If using Firebase storage

const config = {
    apiKey: "AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8",
    authDomain: "pedubon-2020.firebaseapp.com",
    databaseURL: "https://pedubon-2020.firebaseio.com",
    projectId: "pedubon-2020",
    storageBucket: "pedubon-2020.appspot.com",
    messagingSenderId: "793612297896",
    appId: "1:793612297896:web:51782ab8f4e8d5f1aa849d",
    measurementId: "G-7STHE2YKPY"
};
firebase.initializeApp(config);


export { firebase as default };