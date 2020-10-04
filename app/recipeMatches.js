// get user ingredients and render to the html dom
const searchButton = document.querySelector('.search-button')
searchButton.addEventListener('click', (e) => {
    const recipeLister = document.querySelector('.outer-recipe-container')
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get()
            .then(async doc => {
                let userIngredientsList = doc.data().ingredients
                console.log(userIngredientsList)
                const matchedRecipes = await search(userIngredientsList, 'cc7d838a21eb47939d601cf028e608ee') // dont commit this with this key!
                console.log(matchedRecipes)
                let html = ''
                // const matchedRecipes = [
                //     {
                //         title: 'Tuna Pasta',
                //         score: 89,
                //         pricePerServing: 160,
                //         readyIn: 60,
                //         summary: 'adwazfgaegagasgsagagda',
                //         sourceUrl: 'http://google.com'
                //     },
                //     {
                //         title: 'Other Pasta',
                //         score: 80,
                //         pricePerServing: 100,
                //         readyIn: 45,
                //         summary: 'adawfasfawfsasfawsfasfas',
                //         sourceUrl: 'http://google.com'
                //     }
                // ]
                matchedRecipes.forEach(recipe => {
                    // let li = document.createElement('li')
                    const div =
                            `<div class="container recipe-matches-container">
                            <div class="row recipe-info-container">
                                <div class="col-6 col-md-3 recipe-image">
                                    <img src="${recipe.image}" alt="Card image" class="recipe-img-link">
                                </div>
                                <div class="col-6 col-md-9">
                                    <h3 class="recipe-title">${recipe.title}</h3>
                                    <i class="far fa-heart favorite-icon"></i>
                                    <div class="recipe-graphic-container">
                                    <div class="icon-container">
                                        <i class="fas fa-dollar-sign icon"></i>
                                        <p>$${recipe.pricePerServing} per serving</p>
                                    </div>
                                    <div class="icon-container">
                                        <i class="far fa-clock icon"></i>
                                        <p class="graphic-text">Ready in ${recipe.readyIn} min</p>
                                    </div>
                                    <div class="icon-container">
                                        <i class="far fa-smile icon"></i>
                                        <p>Satisfaction: ${recipe.score}%</p>
                                    </div>
                                    </div>
                                    <p class="recipe-summary">${recipe.summary}</p>
                                    <a href="${recipe.sourceUrl}" class="recipe-url">Get the Recipe >></a>
                                </div>
                            </div>
                        </div>`
                    html += div
                    // recipeLister.appendChild(li)
                })
                recipeLister.innerHTML = html
            })
        }
        else {
            console.log('login to start getting matched with recipes')
        }
    })
})

// hiding search button and displaying message if the user tries to access the recipes page without being signed in
firebase.auth().onAuthStateChanged(function(user) {
    const message = document.querySelector('.login-signup-message')
    if(user) {
        searchButton.style.display = 'block';
        message.style.display = "none";
    } else {
        searchButton.style.display = 'none';
        message.style.display = "block";
    }
})

// might put this into a function that is called after the above function is done running, as results with hearts
// are only rendered after the user searches for recipes
// fill in heart on click - also need to add it to user database
const favoriteIcon = document.querySelectorAll('.favorite-icon')
for (let i = 0; i < favoriteIcon.length; i++) {
    favoriteIcon[i].addEventListener('click', (e) => {
        // prevents user from clicking on item already clicked
        if (favoriteIcon[i].classList.contains('fas')) {
            return;
        }
        favoriteIcon[i].classList.remove('far')
        favoriteIcon[i].classList.add('fas')
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).get()
                .then(doc => {
                    let userRecipeList = doc.data().recipes;
                    const recipeUrl = document.querySelector(".recipe-url").href
                    const recipeImg = document.querySelector('.recipe-img-link').src
                    const recipeTitle = document.querySelector('.recipe-title').textContent
                    const recipeData = {
                        recipeUrl,
                        recipeImg,
                        recipeTitle
                    }
                    userRecipeList.push(recipeData)
                    
                    db.collection('users').doc(user.uid).update({recipes: userRecipeList})
                    .then(() => console.log("updated successfully"))
                    .catch(e => console.log(e.message))
                })
            }
        })
    })
}