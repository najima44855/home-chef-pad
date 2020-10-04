// file for scripts pertaining to listing all ingredients they current have stored in their profile
// what to do if the user has no ingredients currently stored in their profile?

// should move some of these methods into like a db file where they can be accessed

// setup ingredients list render
const setupIngredientsList = (data) => {
    const ingredientsList = document.querySelector('.ingredientList')
    let html = ''
    data.ingredients.forEach(ingredient => {
        const searchUrl = "https://www.google.com/search?q=" + ingredient + " food" + "&source=lnms&tbm=isch";
        const proxyurl = "https://cors-anywhere.herokuapp.com/";

        fetch(proxyurl + searchUrl) // https://cors-anywhere.herokuapp.com/https://example.com
        .then(response => response.text())
        .then(contents => {
            console.log(contents);


            var el = $( '<div></div>' );
            el.html(contents);


            let srcToImg = $('img', el).first().attr('src')
            console.log(srcToImg);
        })
        .catch(() => console.log("Can’t access " + searchUrl + " response. Blocked by browser?"))

        const li = `<li>
            <div id="${ingredient}">
                <button type="button" class="deleteIngredient">delete</button>
                ${ingredient}
            </div>
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
    $(document).on('click', '.addIngredient', function() {
        db.collection('users').doc(user.uid).get()
        .then(doc => {
            let userIngredientsList = doc.data().ingredients;
            let ingredientSelector = $('#ingredientSelector');
            let additions = ingredientSelector.select2('data');

            if (additions.length == 0) {
                alert('Please enter one or more ingredients');
                return;
            }

            additions.forEach((ingredient) => {
                userIngredientsList.push(ingredient.text);
            })
            
            ingredientSelector.val(null).trigger('change');
            db.collection('users').doc(user.uid).update({ingredients: userIngredientsList})
            .then(() => console.log("posted successfully"))
            .catch(e => console.log(e.message))
        })
    });
}

// deletes ingredient with specific id
const deleteIngredient = (user) => {
    $(document).on('click', '.deleteIngredient', function() {
        db.collection('users').doc(user.uid).get()
        .then(doc => {
            let userIngredientsList = doc.data().ingredients;
            // queries the user ingredients list and removes the element with the matching id
            userIngredientsList.splice(userIngredientsList.indexOf($(this).parent().attr('id')), 1); 
            db.collection('users').doc(user.uid).update({ingredients: userIngredientsList})
            .then(() => console.log("deleted successfully"))
            .catch(e => console.log(e.message))
        })
    });
}

// Sets up ingredient selector
const setup = () => {
    $(document).ready(function(){
        $("#ingredientSelector").select2({
            tags: true
        });

        var data = ['cheese', 'tomato'];

        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += "<option>" + data[i].replace('-', ' ') + "</option>";
        }
        
        $('#ingredientSelector').html(html);
    });
}