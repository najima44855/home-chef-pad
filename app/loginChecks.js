// change navbar headers from login/signup to profile/logout
// renders conditional html when user is logged in vs when user is logged out
// place in all html pages, as all pages will have access to the navbar and the logout modal
firebase.auth().onAuthStateChanged(user => {
    let signup_or_profile = document.querySelector('.signup-profile-toggle')
    let login_or_logout = document.querySelector('.login-logout-toggle')
    if (user) {
        console.log(user) // remove later
        // logic for navbar
        signup_or_profile.innerText = "Profile"
        signup_or_profile['href'] = './profile.html'
        login_or_logout.innerText = "Logout"

        // logic for logout modal
        login_or_logout.setAttribute('data-toggle', 'modal')
        login_or_logout.setAttribute('data-target', '#logout-modal')
    } else {
        // logic for navbar
        signup_or_profile.innerText = "Signup"
        signup_or_profile['href'] = './signup.html'
        login_or_logout.innerText = "Login"
        login_or_logout['href'] = './login.html'

        // logic for logout modal
        login_or_logout.removeAttribute('data-toggle')
        login_or_logout.removeAttribute('data-target')
    }
})

// might delete this method, unecessary listener
const checkUserLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            return true
        }
        return false
    })
}