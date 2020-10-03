// Configures and initializes firebase 
const firebaseConfig = {
    // apiKey: process.env.APIKEY,
    // authDomain: process.env.AUTH_DOMAIN,
    // databaseURL: process.env.DATABASE_URL,
    // projectId: process.env.PROJECT_ID,
    // storageBucket: process.env.STORAGE_BUCKET,
    // messagingSenderId: process.env.MESSAGING_SENDER_ID,
    // appId: process.env.APP_ID,
    // measurementId: process.env.MEASUREMENT_ID
    apiKey: "AIzaSyBCW7c9yA7Q4iGsBsDUvoMIfWh6fiG2OWE",
    authDomain: "home-chef-pad.firebaseapp.com",
    databaseURL: "https://home-chef-pad.firebaseio.com",
    projectId: "home-chef-pad",
    storageBucket: "home-chef-pad.appspot.com",
    messagingSenderId: "560242139810",
    appId: "1:560242139810:web:335d157ec2d65417dc2dfb",
    measurementId: "G-QMHGY4LWRH"
}
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()