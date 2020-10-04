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
            recipes: [],
            firstName,
            lastName
        }
        db.collection("users").doc(userId).set(userData).then(() => {
            console.log("User successfully added to the DB!");
            window.location.href = "../extension/html/recipes.html"; // redirect user to their profile page
        })
        .catch((e) => {
            console.log("Error adding user to the DB: ", e);
        });
    })
})