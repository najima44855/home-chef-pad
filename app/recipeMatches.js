// get user ingredients and render to the html dom
const searchButton = document.querySelector('.search-button')
searchButton.addEventListener('click', (e) => {
    const recipeLister = document.querySelector('.recipe-lister')
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get()
            .then(async doc => {
                let userIngredientsList = doc.data().ingredients
                console.log(userIngredientsList)
                const matchedRecipes = await search(userIngredientsList, '276ea105bcdb477cb6ee5f5569ce2762') // dont commit this with this key!
                console.log(matchedRecipes)
                matchedRecipes.forEach(recipe => {
                    let li = document.createElement('li')
                    li.innerHTML =
                            `<div class="container recipe-matches-container">
                            <div class="row recipe-info-container">
                                <div class="col-6 col-md-3 recipe-image">
                                    <img src="${recipe.image}" alt="Card image">
                                </div>
                                <div class="col-6 col-md-9">
                                    <h3>${recipe.title}</h3>
                                    <div class="recipe-graphic-container">
                                    <div class="icon-container">
                                        <i class="fas fa-dollar-sign icon"></i>
                                        <p>$${recipe.pricePerServing}</p>
                                    </div>
                                    <div class="icon-container">
                                        <i class="far fa-clock icon"></i>
                                        <p class="graphic-text">Ready in ${recipe.readyIn} min</p>
                                    </div>
                                    <div class="icon-container">
                                        <i class="far fa-smile icon"></i>
                                        <p>Match: ${recipe.score}%</p>
                                    </div>
                                    </div>
                                    <p class="recipe-summary">${recipe.summary}</p>
                                    <a href="${recipe.sourceUrl}">Get the Recipe >></a>
                                </div>
                            </div>
                        </div>`
                    recipeLister.appendChild(li)
                })
            })
        }
        else {
            console.log('login to start getting matched with recipes')
        }
    })
})