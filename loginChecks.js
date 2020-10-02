// change navbar headers from login/signup to profile/logout
// place in all html pages, as all pages will have access to the navbar
firebase.auth().onAuthStateChanged(user => {
    let signup_or_profile = document.querySelector('.signup-profile-toggle')
    let login_or_logout = document.querySelector('.login-logout-toggle')
    if (user) {
        signup_or_profile.innerText = "Profile"
        signup_or_profile['href'] = './profile.html'
        login_or_logout.innerText = "Logout"
        login_or_logout['href'] = './logout.html' // might change later to a popover
    } else {
        signup_or_profile.innerText = "Signup"
        signup_or_profile['href'] = './signup.html'
        login_or_logout.innerText = "Login"
        login_or_logout['href'] = './login.html' // might change later to a popover
    }
})

const checkUserLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            return true
        }
        return false
    })
}