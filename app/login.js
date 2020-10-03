//login
const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
        console.log(cred)
    })
    // user logged in with incorrect credentials - maybe add some html like what bootstrap does for forms
    .catch(e => {
        console.log("Incorrect credentials on login - incorrect username or password")
    })
})