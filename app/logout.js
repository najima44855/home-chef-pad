const logout = document.querySelector('.logout')
logout.addEventListener('click', (e) => {
    console.log('clicked')
    e.preventDefault()
    auth.signOut()
    .then(() => {
        console.log('user signed out')
    })
    .catch(e => {
        console.log(e.message)
    })
})