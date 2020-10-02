// file for scripts pertaining to listing all ingredients they current have stored in their profile
// what to do if the user has no ingredients currently stored in their profile?

// setup ingredients list render
const setupIngredientsList = (data) => {
    const ingredientsList = document.querySelector('.ingredientList')
    let html = ''
    data.forEach(doc => {
        const profile = doc.data()
        profile.ingredients.forEach(ingredient => {
            const li = `<li>
                <div>${ingredient}</div>
            </li>`
            html += li
        })
    })
    ingredientsList.innerHTML = html
}

// checks for current user and displays ingredients only in that users profile
let user = firebase.auth().currentUser
db.collection('users').doc(user.uid).onSnapshot(snapshot => {
    // method to render current ingredients list for the user logged in
    setupIngredientsList(snapshot.docs)
}, err => {
    console.log(err.message)
})