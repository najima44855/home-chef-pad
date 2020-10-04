const weightings = {
    baking: .8,
    healthFoods: .5,
    spicesAndSeasonings: .25,
    pastaAndRice: .9,
    breadBakery: .75,
    refrigerated: .8,
    cannedAndJarred: .8,
    frozen: .75,
    nutButtersJamsAndHoney: .25,
    oilVinegarSaladDressing: .5,
    condiments: .2,
    savorySnacks: .1,
    milkEggsOtherDairy: .7,
    ethnicFoods: .5,
    teaAndCoffee: .2,
    meat: .9,
    gourmet: .6,
    sweetSnacks: .1,
    glutenFree: .75,
    alchoholicBeverages: .3,
    cereal: .5,
    nuts: .5,
    beverages: .3,
    produce: .9,
    notInGroceryStoreHomemade: .75,
    seafood: .9,
    cheese: .8,
    driedFruits: .3,
    online: .1,
    grillingSupplies: .1,
    bread: .9
}

function search(ingredients, key) {
    
    let query = "https://api.spoonacular.com/recipes/findByIngredients?number=100&ranking=2&addRecipeInformation=true&ingredients=";
    for (var i = ingredients.length - 1; i >= 0; i--) {
        query += ingredients[i];
        if (i > 0) {
            query += ',';
        }
    }

    query += "&apiKey=" + key;

    opts = {
        url: query,
    }

    fetch(query)
        .then(res => res.json())
        .then(function(data) {
                // Build url for new query which gets more recipe data
                let query = "https://api.spoonacular.com/recipes/informationBulk?ids=";

                // recipes = JSON.parse(data);
                let recipes = data;
                let ids = recipes.map(function(result) {
                    return result.id;
                });

                for (let i = 0; i < ids.length; i++) {
                    query += ids[i];
                    if (ids.length - i - 1) query += ',';
                }

                query += "&apiKey=" + key;

                fetch(query)
                    .then(res => res.json())
                    .then(function(data) {
                            // let recipeData = JSON.parse(body);
                            let recipeData = data;
                            data = evaluate(recipes, recipeData);

                            console.log(data);
                        }
                    )
                    .catch(err => console.log(err))
            }
        )
        .catch(err => console.log(err));

    // request(opts, function(err, res, body) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }

    //     // Build url for new query which gets more recipe data
    //     let query = "https://api.spoonacular.com/recipes/informationBulk?ids=";

    //     recipes = JSON.parse(body);
    //     let ids = recipes.map(function(result) {
    //         return result.id;
    //     });

    //     for (let i = 0; i < ids.length; i++) {
    //         query += ids[i];
    //         if (ids.length - i - 1) query += ',';
    //     }

    //     query += "&apiKey=" + key;

    //     opts = {
    //         url: query
    //     }

    //     // Grab info about each recipe we found
    //     request(opts, function(err, res, body) {
    //         if (err) {
    //             console.log(err);
    //             return;
    //         }

    //         let recipeData = JSON.parse(body);
    //         data = evaluate(recipes, recipeData);

    //         // console.log(data);

    //         /*

    //         the variable 'data' stores the JSON response

    //         */
    //     });
    // });   
}

function evaluate(recipes, recipeData) {

    let data = [];
    
    for (let i = 0; i < recipes.length; i++) {

        let recipe = recipes[i];
        let additionalData = recipeData[i];

        function grab(obj) {
            let categories = obj['aisle'];
            categories = categories.split(';');
            categories = categories.map(function(cat) {
                return toCamelCase(removePunct(cat));
            });
            
            return {
                name: obj['name'],
                categories: categories
            }
        }

        let missed = recipe.missedIngredients.map(grab);
        let used = recipe.usedIngredients.map(grab);
        let unused = recipe.unusedIngredients.map(grab);

        let importance;
        if (missed[0] == undefined) {
            importance = 1;
        } else {
            importance = 1 - Math.max.apply(Math, missed[0].categories.map(function(name) {
                return weightings[name];
            }));
        }

        let missedRatio = 1 - (missed.length / (missed.length + used.length + unused.length));
        let popularity = additionalData.spoonacularScore / 100;

        // clean up the url
        url = "https://spoonacular.com/recipes/";
        url += removePunct(recipe.title.toLowerCase()) + '-' + recipe.id;
        while (url.includes(' ')) {
            url = url.replace(' ', '-');
        }

        data.push({
            title: recipe.title,
            score: additionalData.spoonacularScore,
            pricePerServing: additionalData.pricePerServing,
            readyIn: additionalData.readyInMinutes,
            summary: additionalData.summary,
            url: url,
            sourceUrl: additionalData.sourceUrl,
            image: additionalData.image,
            relevance: (1/3) * (importance + missedRatio + popularity)
        });

    }

    return data.sort(sortBy('relevance'));
}

// function filter(results, field) {

//     for (let i = results.length; i > )

// }

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

function removePunct(str) {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, '');
}

function sortBy(field) {
    return function(a, b) {
        if (a[field] > b[field]) {
            return -1;
        } else if (a[field] < b[field]) {
            return 1;
        }
        return 0;
    };
}

// search(['eggs', 'bread', 'milk', 'cheese', 'chicken', 'flour', 'tomato', 'beef', 'ketchup', 'salt', 'pepper'], "");
