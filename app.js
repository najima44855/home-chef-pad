

// configuring firebase
const firebaseConfig = config
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
