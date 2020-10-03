// might split file up, as login and signup are on separate pages
// still need to allow users to add ingredients 

// getting data for the specific user if they are logged in
// let user = firebase.auth().currentUser
// db.collection('users').get()
// .then(snapshot => {
//     // method to render current ingredients list for the user logged in
//     setupIngredientsList(snapshot.docs)
// })
// .catch(e => {
//     console.log(e.message)
// })

// listen for auth changes
// useful for conditional rendering and restricting data the user sees
// not sure I actually need this
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in', user)
    } else {
        console.log('user logged out')
    }
})

// signing up
const signupForm = document.querySelector('.signupForm')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // get user info entered
    const firstName = document.querySelector('.signup-first-name').value
    const lastName = document.querySelector('.signup-last-name').value
    const email = document.querySelector('.signup-email').value
    const password = document.querySelector('.signup-password').value

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
        const userId = credential.user.uid 
        const userData = {
            ingredients: [],
            firstName,
            lastName
        }
        db.collection("users").doc(userId).set(userData).then(() => {
            console.log("User successfully added to the DB!");
            // window.location.href = "./profile.html"; // redirect user to their profile page
        })
        .catch((e) => {
            console.log("Error adding user to the DB: ", e);
        });
    })
})

// logout - not working for some reason
// const logout = document.querySelector('.logout')
// logout.addEventListener('click', (e) => {
//     console.log('clicked')
//     e.preventDefault()
//     auth.signOut()
//     .then(() => {
//         console.log('user signed out')
//     })
//     .catch(e => {
//         console.log(e.message)
//     })
// })

//login
// const loginForm = document.querySelector('.login-form')
// loginForm.addEventListener('submit', (e) => {
//     e.preventDefault()
//     const email = document.querySelector('#login-email').value
//     const password = document.querySelector('#login-password').value
//     auth.signInWithEmailAndPassword(email, password)
//     .then(cred => {
//         console.log(cred)
//     })
//     // user logged in with incorrect credentials - maybe add some html like what bootstrap does for forms
//     .catch(e => {
//         console.log("Incorrect credentials on login - incorrect username or password")
//     })
// })