import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

const config = {
  apiKey: "AIzaSyBta9DDBUcBpAryyLyydx023DgR-IyPT5U",
  authDomain: "slide-act.firebaseapp.com",
  databaseURL: "https://slide-act.firebaseio.com",
  projectId: "slide-act",
  storageBucket: "slide-act.appspot.com",
  messagingSenderId: "460368179429",
  appId: "1:460368179429:web:50fe73375fdd907c4a240c",
  measurementId: "G-TXVWYNZ0G4"
};

const firebaseApp = firebase.initializeApp(config, 'slide-act')

export default firebaseApp