// file for scripts pertaining to listing all ingredients they current have stored in their profile
// what to do if the user has no ingredients currently stored in their profile?

// should move some of these methods into like a db file where they can be accessed

// setup ingredients list render
const setupIngredientsList = (data) => {
    const ingredientsList = document.querySelector('.ingredientList')
    let html = ''
    data.ingredients.forEach(ingredient => {
        const li = `<li>
            <div>${ingredient}</div>
        </li>`
        html += li
    })
    ingredientsList.innerHTML = html
}

// this is currently handling profile crud operations: not good 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        updateIngredientRender(user)
        addIngredient(user)
        deleteIngredient(user)
    } else {
      console.log('something is obviously wrong here, profile page should be inacessible unless user logged in')
    }
});

updateIngredientRender = (user) => {
    // checks for current user and displays ingredients only in that users profile
    db.collection('users').doc(user.uid).onSnapshot(snapshot => {
        // method to render current ingredients list for the user logged in
        setupIngredientsList(snapshot.data())
    }, err => {
        console.log(err.message)
    })
}


// adding to the ingredient database
const addIngredient = (user) => {
    const matchedIngredientsList = document.querySelectorAll('.ingredientContainer') // change later
    matchedIngredientsList[0].addEventListener('click', e => {
        db.collection('users').doc(user.uid).get()
        .then(doc => {
            let userIngredientsList = doc.data().ingredients;
            userIngredientsList.push(matchedIngredientsList[0].outerText)
            db.collection('users').doc(user.uid).update({ingredients: userIngredientsList})
            .then(() => console.log("updated successfully"))
            .catch(e => console.log(e.message))
        })
    })
}

// test: deletes first ingredient
const deleteIngredient = (user) => {
    const deleteBtn = document.querySelector('.deleteIngredient')
    deleteBtn.addEventListener('click', e => {
        db.collection('users').doc(user.uid).get()
        .then(doc => {
            let userIngredientsList = doc.data().ingredients;
            userIngredientsList.shift()
            db.collection('users').doc(user.uid).update({ingredients: userIngredientsList})
            .then(() => console.log("deleted successfully"))
            .catch(e => console.log(e.message))
        })
    })
}