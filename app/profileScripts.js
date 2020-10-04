// file for scripts pertaining to listing all ingredients they current have stored in their profile
// what to do if the user has no ingredients currently stored in their profile?

// should move some of these methods into like a db file where they can be accessed

// setup ingredients list render
const setupIngredientsList = (data) => {
    const ingredientsList = document.querySelector('.ingredientList')
    let html = ''
    data.ingredients.forEach(ingredient => {
        var imageUrl = "";
        imageUrl = getImageUrl(ingredient, function(ingredient) {
            return ingredient;
        });
        imageUrl = "https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg";
        const li = `<li>
            <div id="${ingredient}">
                <img src=${imageUrl} width="150px" />
                <button type="button" class="deleteIngredient">delete</button>
                ${ingredient}
            </div>
        </li>`
        html += li
    })
    ingredientsList.innerHTML = html
}

function getImageUrl(ingredient, callback) {
    var xmlhttp = new XMLHttpRequest();
    const url = 'https://api.unsplash.com/search/photos?query=' + ingredient + '&client_id=-hTRcqf09FnTMrV1yhTQnT_Qa5KDFHkpU0Mlhs_zOpQ&per_page=1';
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200) {
            content = JSON.parse(xmlhttp.responseText);
            imageUrl = content.results[0].urls.full;
            if(imageUrl != '' && (imageUrl)) {
                callback(imageUrl);
            } else {
                callback("");
            }
        }
    }
    xmlhttp.open('GET', url);
    xmlhttp.send();
}

// this is currently handling profile crud operations: good 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        deleteRecipe(user)
        updateIngredientRender(user)
        addIngredient(user)
        deleteIngredient(user)
    } else {
      console.log('something is obviously wrong here, profile page should be inacessible unless user logged in')
    }
});

// use this function to also render the recipes list
updateIngredientRender = (user) => {
    // checks for current user and displays ingredients only in that users profile
    db.collection('users').doc(user.uid).onSnapshot(snapshot => {
        // method to render current ingredients list for the user logged in
        setupIngredientsList(snapshot.data())
        setupRecipeList(snapshot.data(), user)
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

// list recipes in user's profile by using bootstrap cards
const setupRecipeList = (data, user) => {
    const recipeContainer = document.querySelector('.recipe-container')
    const userRecipes = data.recipes
    let html = ''
    userRecipes.forEach(recipe => {
        const card = `
        <div class="card recipe-card">
            <img src=${recipe.recipeImg} class="card-img-top" alt="...">
            <i class="fas fa-times delete-recipe-x"></i>
            <div class="card-body">
                <a href="${recipe.recipeUrl}">${recipe.recipeTitle}</a>
            </div>
        </div>`

        html += card
    })
    recipeContainer.innerHTML = html
    deleteRecipe(user)
}

// deletes recipe from user profile
const deleteRecipe = (user) => {
    const deleteButtons = document.querySelectorAll('.delete-recipe-x')
    for(let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', (e) => {
            db.collection('users').doc(user.uid).get()
            .then(doc => {
                let userRecipeList = doc.data().recipes;
                userRecipeList.splice(i, 1)
                db.collection('users').doc(user.uid).update({recipes: userRecipeList})
                .then(() => console.log("deleted successfully"))
                .catch(e => console.log(e.message))
            })
            .catch(e => console.log(e.message))
        })
    }
}

// Sets up ingredient selector
const setup = () => {
    $(document).ready(function(){
        $("#ingredientSelector").select2({
            tags: true
        });

        var data = ['5 Spice Powder', 'Acorn Squash', 'Adobo Sauce', 'Agave Nectar', 'Ahi Tuna', 'Alfredo Pasta Sauce', 'Almond Extract', 'Almond Flour', 'Almond Milk', 'Almonds', 'Amaretto', 'Ancho Chiles', 'Anchovies', 'Andouille Sausage', 'Angel Food Cake Mix', 'Angel Hair Pasta', 'Angostura Bitters', 'Apple', 'Apple Butter Spread', 'Apple Cider', 'Apple Juice', 'Apple Pie Spice', 'Apricot Preserves', 'Apricots', 'Arborio Rice', 'Arrowroot Powder', 'Artichoke Heart Quarters', 'Artichokes', 'Arugula', 'Asafoetida', 'Asafoetida Powder', 'Asiago Cheese', 'Asian Pear', 'Asparagus Spears', 'Avocado', 'Avocado Oil', 'Baby Bell Peppers', 'Baby Bok Choy', 'Baby Carrots', 'Baby Corn', 'Baby Spinach Leaves', 'Baby-Back Ribs', 'Baby-Back Ribs', 'Bacon', 'Bacon Fat', 'Baguette', 'Baking Bar', 'Baking Powder', 'Baking Soda', 'Balsamic Glaze', 'Balsamic Vinegar', 'Bamboo Shoots', 'Banana', 'Basmati Rice', 'Bay Leaves', 'Bbq Sauce', 'Beans', 'Beef', 'Beef Brisket', 'Beef Broth', 'Beef Chuck Roast', 'Beef Stock', 'Beef Tenderloin', 'Beer', 'Beer', 'Beets', 'Bell Pepper', 'Berries', 'Biscuit Mix', 'Biscuits', 'Bittersweet Chocolate', 'Black Bean Sauce', 'Black Beans', 'Black Olives', 'Black Pepper', 'Black Sesame Seeds', 'Blackberries', 'Blanched Almonds', 'Blood Orange', 'Blue Cheese', 'Blueberries', 'Bok Choy', 'Boneless Skinless Chicken Breast', 'Bourbon', 'Brandy', 'Bread', 'Bread Flour', 'Breakfast Links', 'Brie', 'Broccoli', 'Broccoli Florets', 'Brown Rice', 'Brown Rice Flour', 'Brown Sugar', 'Brownie Mix', 'Brussel Sprouts', 'Bulgur', 'Butter', 'Butterhead Lettuce', 'Buttermilk', 'Butternut Squash', 'Butterscotch Chips', 'Cabbage', 'Caesar Dressing', 'Cajun Seasoning', 'Cake Flour', 'Candy Canes', 'Candy Coating', 'Candy Melts', 'Canned Black Beans', 'Canned Diced Tomatoes', 'Canned Garbanzo Beans', 'Canned Green Chiles', 'Canned Kidney Beans', 'Canned Mushrooms', 'Canned Pinto Beans', 'Canned Red Kidney Beans', 'Canned Tomatoes', 'Canned Tuna', 'Canned White Beans', 'Canned White Cannellini Beans', 'Cannellini Beans', 'Cantaloupe', 'Capers', 'Caramel Sauce', 'Caramels', 'Caraway Seed', 'Cardamom', 'Cardamom Pods', 'Carp', 'Carrots', 'Cat Fish Filets', 'Cauliflower', 'Cauliflower Florets', 'Cauliflower Rice', 'Celery', 'Celery Ribs', 'Celery Root', 'Celery Salt', 'Celery Seed', 'Cereal', 'Champagne', 'Chana Dal', 'Cheddar', 'Cheese', 'Cheese Curds', 'Cheese Dip', 'Cheese Soup', 'Cheese Tortellini', 'Cherry', 'Cherry Pie Filling', 'Cherry Tomatoes', 'Chestnuts', 'Chia Seeds', 'Chicken Base', 'Chicken Bouillon', 'Chicken Bouillon Granules', 'Chicken Breasts', 'Chicken Broth', 'Chicken Drumsticks', 'Chicken Legs', 'Chicken Pieces', 'Chicken Sausage', 'Chicken Stock', 'Chicken Tenders', 'Chicken Thighs', 'Chicken Wings', 'Chickpea', 'Chile Garlic Sauce', 'Chili Paste', 'Chili Peppers', 'Chili Powder', 'Chili Sauce', 'Chipotle Chiles In Adobo', 'Chipotle Chilies', 'Chipotle Peppers In Adobo', 'Chive & Onion Cream Cheese Spread', 'Chocolate', 'Chocolate Chip Cookies', 'Chocolate Chunks', 'Chocolate Ice Cream', 'Chocolate Milk', 'Chocolate Sandwich Cookies', 'Chocolate Syrup', 'Chocolate Wafer Cookies', 'Chorizo Sausage', 'Cider Vinegar', 'Cilantro', 'Cinnamon Roll', 'Cinnamon Stick', 'Cinnamon Sugar', 'Cinnamon Swirl Bread', 'Clam Juice', 'Clams', 'Clarified Butter', 'Clove', 'Coarse Salt', 'Coarsely Ground Pepper', 'Cocoa Nibs', 'Cocoa Powder', 'Coconut', 'Coconut Aminos', 'Coconut Butter', 'Coconut Cream', 'Coconut Extract', 'Coconut Flour', 'Coconut Milk', 'Coconut Oil', 'Coconut Water', 'Cod', 'Coffee', 'Cognac', 'Cola', 'Colby Jack', 'Collard Greens', 'Condensed Cream Of Celery Soup', 'Condensed Cream Of Mushroom Soup', "Confectioner'S Swerve", 'Cooked Bacon', 'Cooked Brown Rice', 'Cooked Chicken Breast', 'Cooked Ham', 'Cooked Long Grain Rice', 'Cooked Pasta', 'Cooked Polenta', 'Cooked Quinoa', 'Cooked Wild Rice', 'Cookies', 'Coriander', 'Corn', 'Corn Bread Mix', 'Corn Chips', 'Corn Flakes Cereal', 'Corn Flour', 'Corn Kernels', 'Corn Oil', 'Corn Tortillas', 'Cornbread', 'Corned Beef', 'Cornish Hens', 'Cornmeal', 'Cornstarch', 'Cotija Cheese', 'Cottage Cheese', 'Country Bread', 'Courgettes', 'Couscous', 'Cow Pea', 'Crabmeat', 'Cracked Pepper', 'Cranberries', 'Cranberry Juice', 'Cream', 'Cream Cheese', 'Cream Cheese Block', 'Cream Of Chicken Soup', 'Cream Of Tartar', 'Creamed Corn', 'Creamy Peanut Butter', 'Creme Fraiche', 'Cremini Mushrooms', 'Creole Seasoning', 'Crisp Rice Cereal', 'Croutons', 'Crystallized Ginger', 'Cucumber', 'Cumin Seeds', 'Cup Cake', 'Currants', 'Curry Leaves', 'Dairy Free Milk', 'Dark Brown Sugar', 'Dark Chocolate', 'Dark Chocolate Candy Bars', 'Dark Chocolate Chips', 'Dark Sesame Oil', 'Dates', 'Deep Dish Pie Crust', 'Deli Ham', 'Deli Turkey', 'Dessert Oats', 'Dessert Wine', 'Diced Ham', 'Diet Pop', 'Dijon Mustard', 'Dill', 'Dill Pickles', 'Hot Dog', 'Double Cream', 'Dried Apricots', 'Dried Basil', 'Dried Cherries', 'Dried Chorizo', 'Dried Cranberries', 'Dried Dill', 'Dried Onion', 'Dried Porcini Mushrooms', 'Dried Rubbed Sage', 'Dried Thyme', 'Dried Tomatoes', 'Dry Bread Crumbs', 'Dry Milk', 'Dry Mustard', 'Dry Red Wine', 'Dry Roasted Peanuts', 'Duck Fat', 'Dutch Process Cocoa Powder', 'Edamame', 'Egg Substitute', 'Egg Vermicelli', 'Egg Whites', 'Egg Yolk', 'Eggnog', 'Eggplant', 'Elbow Macaroni', 'Enchilada Sauce', 'English Cucumber', 'English Muffin', 'Erythritol', 'Escarole', 'Espresso', 'Evaporated Milk', 'Extra Firm Tofu', 'Extra Virgin Olive Oil', 'Farfalle', 'Farro', 'Fat Free Mayo', 'Fat-Free Less-Sodium Chicken Broth', 'Fennel', 'Fennel Seeds', 'Fenugreek Leaf', 'Fenugreek Seeds', 'Feta Cheese', 'Fettuccine', 'Fire Roasted Tomatoes', 'Fish', 'Fish Sauce', 'Fish Stock', 'Flank Steak', 'Flax Seeds', 'Fleur De Sel', 'Flour', 'Flour Tortillas', 'Fontina Cheese', 'Food Dye', "Frank'S Redhot Sauce", 'Free Range Eggs', 'French Bread', 'Fresh Basil', 'Fresh Bean Sprouts', 'Fresh Chives', 'Fresh Corn', 'Fresh Corn Kernels', 'Fresh Figs', 'Fresh Fruit', 'Fresh Herbs', 'Fresh Mint', 'Fresh Mozzarella', 'Fresh Rosemary', 'Fresh Thyme Leaves', 'Fried Onions', 'Frosting', 'Froyo Bars', 'Frozen Corn', 'Frozen Spinach', 'Fudge', 'Fudge Topping', 'Fun Size Almond Joy Bar', 'Garam Masala', 'Garbanzo Bean Flour', 'Garlic', 'Garlic Paste', 'Garlic Powder', 'Garlic Powder', 'Garlic Salt', 'Gelatin', 'Gf Chocolate Cake Mix', 'Gin', 'Ginger', 'Ginger Ale', 'Ginger Paste', 'Ginger-Garlic Paste', 'Gingersnap Cookies', 'Gnocchi', 'Goat Cheese', 'Golden Raisins', 'Gorgonzola', 'Gouda Cheese', 'Graham Cracker Crumbs', 'Graham Cracker Pie Crust', 'Graham Crackers', 'Grain Blend', 'Grand Marnier', 'Granny Smith Apples', 'Granola', 'Granulated Garlic', 'Grape Tomatoes', 'Grapefruit', 'Grapeseed Oil', 'Gravy', 'Great Northern Beans', 'Greek Yogurt', 'Green Beans', 'Green Bell Pepper', 'Green Chili Pepper', 'Green Food Coloring', 'Green Grapes', 'Green Olives', 'Green Onions', 'Greens', 'Grill Cheese', 'Grill Seasoning', 'Ground Allspice', 'Ground Ancho Chili', 'Ground Beef', 'Ground Chicken', 'Ground Chipotle Chile Pepper', 'Ground Cinnamon', 'Ground Cinnamon', 'Ground Cloves', 'Ground Coriander Seeds', 'Ground Cumin', 'Ground Flaxseed', 'Ground Ginger', 'Ground Lamb', 'Ground Mace', 'Ground Nutmeg', 'Ground Pork', 'Ground Pork Sausage', 'Ground Veal', 'Gruyere', 'Guacamole', 'Half N Half', 'Halibut Fillet', 'Ham', 'Hamburger Buns', 'Hard Cooked Eggs', 'Harissa', 'Hash Brown Potatoes', 'Hazelnuts', 'Healthy Request Cream Of Celery Soup', 'Hemp Seeds', 'Herbes De Provence', 'Herbs', "Hershey'S Kisses Brand Milk Chocolates", 'Hoisin Sauce', 'Honey Mustard', 'Horseradish', 'Hot Sauce', 'Hummus', 'Ice', 'Ice Cream', 'Instant Chocolate Pudding Mix', 'Instant Coffee Powder', 'Instant Espresso Powder', 'Instant Lemon Pudding Mix', 'Instant Yeast', 'Irish Cream', 'Italian Bread', 'Italian Cheese Blend', 'Italian Sausages', 'Italian Seasoning', 'Jaggery', 'Jalapeno', 'Jasmine Rice', 'Jelly', 'Jicama', 'Jimmies', 'Juice', 'Jumbo Shell Pasta', 'Kaffir Lime Leaves', 'Kahlua', 'Kalamata Olives', 'Kale', 'Ketchup', 'Kitchen Bouquet', 'Kiwis', 'Kosher Salt', 'Ladyfingers', 'Lamb', 'Lasagna Noodles', 'Lb Cake', 'Lean Ground Beef', 'Lean Ground Turkey', 'Lean Pork Tenderloin', 'Leeks', 'Leg Of Lamb', 'Lemon', 'Lemon Curd', 'Lemon Extract', 'Lemon Juice', 'Lemon Peel', 'Lemon Pepper', 'Lemon Wedges', 'Lemongrass', 'Lettuce', 'Lettuce Leaves', 'Light Butter', 'Light Coconut Milk', 'Light Corn Syrup', 'Light Cream Cheese', 'Light Mayonnaise', 'Light Olive Oil', 'Light Soy Sauce', 'Lime', 'Lime Juice', 'Lime Wedges', 'Lime Zest', 'Linguine', 'Liquid Smoke', 'Liquid Stevia', 'Liquor', 'Live Lobster', 'Long-Grain Rice', 'Low Fat Buttermilk', 'Low Fat Milk', 'Low Fat Milk', 'Low Fat Plain Yogurt', 'Low Fat Ricotta Cheese', 'Low Fat Sour Cream', 'Low Sodium Chicken Broth', 'Low Sodium Soy Sauce', 'Low-Sodium Chicken Stock', 'Lower Sodium Beef Broth', 'Lump Crab', 'M&M Candies', 'Macadamia Nuts', 'Macaroni And Cheese Mix', 'Madras Curry Powder', 'Malt Drink Mix', 'Mandarin Orange Sections', 'Mandarin Oranges', 'Mango', 'Maple Syrup', 'Maraschino Cherries', 'Margarine', 'Marinara Sauce', 'Marjoram', 'Marsala Wine', 'Marshmallow Fluff', 'Marshmallows', 'Masa Harina', 'Mascarpone', 'Mat Beans', 'Matcha Tea', 'Mayonnaise', 'Meat', 'Meat', 'Meatballs', 'Medjool Dates', 'Mexican Cream', 'Meyer Lemon Juice', 'Milk', 'Milk Chocolate Chips', 'Mint Chutney', 'Minute Rice', 'Miracle Whip', 'Mirin', 'Miso', 'Molasses', 'Monterey Jack Cheese', 'Mushroom', 'Mussels', 'Mustard', 'Mustard Seeds', 'Napa Cabbage', 'Navel Oranges', 'Nectarine', 'New Potatoes', 'Non-Fat Greek Yogurt', 'Nonfat Cool Whip', 'Nonfat Milk', 'Nori', 'Nut Butter', 'Nut Meal', 'Nutella', 'Nutritional Yeast', 'Oat Flour', 'Oats', 'Oil', 'Oil Packed Sun Dried Tomatoes', 'Okra', 'Old Bay Seasoning', 'Olive Oil', 'Olives', 'Onion', 'Onion Powder', 'Onion Soup Mix', 'Orange', 'Orange Bell Pepper', 'Orange Juice', 'Orange Juice Concentrate', 'Orange Liqueur', 'Orange Marmalade', 'Orange Oil', 'Orange Zest', 'Oregano', 'Oreo Cookies', 'Orzo', 'Oyster Sauce', 'Oysters', 'Palm Sugar', 'Pancetta', 'Paneer', 'Panko', 'Papaya', 'Paprika', 'Parmigiano Reggiano', 'Parsley', 'Parsley Flakes', 'Parsnip', 'Part-Skim Mozzarella Cheese', 'Pasta', 'Pasta Salad Mix', 'Pasta Sauce', 'Pastry Flour', 'Peach', 'Peanut Butter', 'Peanut Butter Chips', 'Peanut Butter Cups', 'Peanut Oil', 'Peanuts', 'Pear Liqueur', 'Pearl Barley', 'Pearl Onions', 'Peas', 'Pecan', 'Pecan Pieces', 'Pecorino', 'Penne', 'Peperoncino', 'Pepper Jack Cheese', 'Peppercorns', 'Peppermint Baking Chips', 'Peppermint Extract', 'Pepperoni', 'Peppers', 'Pesto', 'Pickle Relish', 'Pickles', 'Pico De Gallo', 'Pie Crust', 'Pimento Stuffed Olives', 'Pimientos', 'Pine Nuts', 'Pineapple', 'Pineapple Chunks', 'Pineapple In Juice', 'Pineapple Juice', 'Pink Himalayan Salt', 'Pinto Beans', 'Pistachios', 'Pita', 'Pizza Crust', 'Pizza Mix', 'Plain Greek Yogurt', 'Plain Nonfat Yogurt', 'Plain Yogurt', 'Plantain', 'Plum', 'Plum Tomatoes', 'Poblano Peppers', 'Polenta', 'Polish Sausage', 'Pomegranate Juice', 'Pomegranate Molasses', 'Pomegranate Seeds', 'Popcorn', 'Poppy Seeds', 'Pork', 'Pork & Beans', 'Pork Belly', 'Pork Butt', 'Pork Chops', 'Pork Links', 'Pork Loin Chops', 'Pork Loin Roast', 'Pork Roast', 'Pork Shoulder', 'Pork Tenderloin', 'Port', 'Portabella Mushrooms', 'Pot Roast', 'Potato Chips', 'Potato Starch', 'Potatoes', 'Poultry Seasoning', 'Powdered Sugar', 'Pretzel Sandwiches', 'Processed American Cheese', 'Prosciutto', 'Provolone Cheese', 'Prunes', 'Puff Pastry', 'Pumpkin', 'Pumpkin Pie Filling', 'Pumpkin Pie Spice', 'Pumpkin Puree', 'Pumpkin Seeds', 'Queso Fresco', 'Quick Cooking Oats', 'Quinoa', 'Quinoa Flour', 'Radicchio', 'Radishes', 'Raisins', 'Rajma Masala', 'Ramen Noodles', 'Ranch Dressing', 'Ranch Dressing Mix', 'Raspberries', 'Raspberry Jam', 'Raw Cashews', 'Raw Shrimp', 'Ready-To-Serve Asian Fried Rice', 'Real Bacon Recipe Pieces', 'Red Apples', 'Red Bell Peppers', 'Red Cabbage', 'Red Chilli', 'Red Delicious Apples', 'Red Food Coloring', 'Red Grapefruit Juice', 'Red Grapes', 'Red Kidney Beans', 'Red Lentils', 'Red Onion', 'Red Pepper Flakes', 'Red Pepper Powder', 'Red Potatoes', 'Red Velvet Cookie', 'Red Wine', 'Red Wine Vinegar', 'Reduced Fat Shredded Cheddar Cheese', 'Refried Beans', 'Refrigerated Crescent Rolls', 'Refrigerated Pizza Dough', 'Refrigerated Sugar Cookie Dough', 'Rhubarb', 'Rib Tips', 'Rice', 'Rice Flour', 'Rice Krispies Cereal', 'Rice Milk', 'Rice Noodles', 'Rice Paper', 'Rice Syrup', 'Rice Vinegar', 'Rice Wine', 'Ricotta Salata', 'Ritz Crackers', 'Roast Beef', 'Roasted Chicken', 'Roasted Nuts', 'Roasted Peanuts', 'Roasted Red Peppers', 'Roma Tomatoes', 'Romaine Lettuce', 'Root Vegetables', 'Rosemary', 'Rotini Pasta', 'Rotisserie Chicken', 'Round Steak', 'Rub', 'Rum Extract', 'Runny Honey', 'Russet Potatoes', 'Rutabaga', 'Rye Bread', 'Rye Meal', 'Saffron Threads', 'Sage', 'Sage Leaves', 'Salad Dressing', 'Salami', 'Salmon Fillet', 'Salsa', 'Salsa Verde', 'Salt', 'Salt And Pepper', 'Salted Butter', 'Saltine Crackers', 'Sandwich Bun', 'Sauerkraut', 'Sausage', 'Sausage Links', 'Scotch Bonnet Chili', 'Sea Salt', 'Sea Scallops', 'Seasoned Bread Crumbs', 'Seasoned Rice Vinegar', 'Seasoned Salt', 'Seasoning', 'Seasoning Blend', 'Seeds', 'Self-Rising Flour', 'Semi Sweet Chocolate Chips', 'Serrano Chile', 'Sesame Oil', 'Sesame Seed Hamburger Buns', 'Sesame Seeds', 'Shallot', 'Sharp Cheddar Cheese', 'Sheeps Milk Cheese', 'Shells', 'Sherry', 'Sherry', 'Sherry Vinegar', 'Shiitake Mushroom Caps', 'Short Grain Rice', 'Short Pasta', 'Short Ribs', 'Shortbread Cookies', 'Shortcrust Pastry', 'Shortening', 'Shredded Cheddar Cheese', 'Shredded Cheese', 'Shredded Chicken', 'Shredded Coconut', 'Shredded Mexican Cheese Blend', 'Shredded Mexican Cheese Blend', 'Shredded Mozzarella', 'Silken Tofu', 'Sirloin Steak', 'Skim Milk Ricotta', 'Skim Vanilla Greek Yogurt', 'Skin-On Bone-In Chicken Leg Quarters', 'Skinless Boneless Chicken Breast Halves', 'Skinless Boneless Chicken Thighs', 'Skinned Black Gram', 'Slaw Dressing', 'Slaw Mix', 'Slivered Almonds', 'Smoked Paprika', 'Smoked Salmon', 'Smoked Sausage', 'Smooth Peanut Butter', 'Snapper Fillets', 'Snow Peas', 'Soda Water', 'Sour Cream', 'Sourdough Bowl', 'Sourdough Bread', 'Soy Milk', 'Soy Protein Powder', 'Soy Sauce', 'Spaghetti', 'Spaghetti Squash', 'Sparkling Wine', 'Spelt Flour', 'Spicy Brown Mustard', 'Spinach', 'Sprite', 'Sprouts', 'Squash', 'Sriracha Sauce', 'Steaks', 'Steel Cut Oats', 'Stevia', 'Stew Meat', 'Stew Vegetables', 'Stock', 'Store-Bought Phyllo', 'Stout', 'Strawberries', 'Strawberry Jam', 'Strawberry Jello', 'Stuffing', 'Stuffing Mix', 'Sub Rolls', 'Sugar', 'Sugar Snap Peas', 'Sugar Syrup', 'Sukrin Sweetener', 'Summer Savory', 'Summer Squash', 'Sunflower Oil', 'Sunflower Seeds', 'Sweet Chilli Sauce', 'Sweet Onion', 'Sweet Paprika', 'Sweet Pickle Juice', 'Sweet Pickle Relish', 'Sweet Potato', 'Sweet Tea', 'Sweetened Coconut', 'Sweetened Condensed Milk', 'Sweetened Shredded Coconut', 'Swiss Chard', 'Swiss Cheese', 'Taco Seasoning Mix', 'Taco Shells', 'Tahini', 'Tamari', 'Tapioca Flour', 'Tarragon', 'Tart Apple', 'Tea Bags', 'Tequila', 'Teriyaki Sauce', 'Thai Basil', 'Thai Chiles', 'Thai Red Curry Paste', 'Thick-Cut Bacon', 'Tilapia Fillets', 'Toast', 'Toffee Bits', 'Tofu', 'Tomatillos', 'Tomato Juice', 'Tomato Paste', 'Tomato Puree', 'Tomato Sauce', 'Tomato Soup', 'Tomatoes', 'Top Blade Steak', 'Top Round Steak', 'Top Sirloin', 'Tortilla', 'Tortilla Chips', 'Triple Sec', 'Truffle Oil', 'Tuna', 'Turbinado Sugar', 'Turkey', 'Turkey Breast', 'Turkey Kielbasa', 'Turmeric', 'Turnips', 'Unbleached Flour', 'Unsalted Butter', 'Unsmoked Back Bacon', 'Unsweetened Applesauce', 'Unsweetened Coconut Milk', 'Unsweetened Shredded Coconut', 'Vanilla Bean', 'Vanilla Bean Paste', 'Vanilla Essence', 'Vanilla Extract', 'Vanilla Frosting', 'Vanilla Instant Pudding Mix', 'Vanilla Protein Powder', 'Vanilla Wafers', 'Vanilla Yogurt', 'Vegan Cheese', 'Vegan Chocolate Chips', 'Vegan Margarine', 'Vegetable Broth', 'Vegetable Oil', 'Vegetarian Bacon', 'Vermouth', 'Vinaigrette', 'Vinegar', 'Vodka', 'Walnuts', 'Water', 'Water Chestnuts', 'Water-Packed Tuna', 'Watercress', 'Watermelon Chunks', 'Wheat Bran', 'Wheat Germ', 'Whipped Cream', 'Whipped Topping', 'Whipping Cream', 'Whiskey', 'White Balsamic Vinegar', 'White Bread', 'White Cake Mix', 'White Cheddar', 'White Chocolate', 'White Chocolate Chips', 'White Onion', 'White Pepper', 'White Whole Wheat Flour', 'White Wine', 'White Wine Vinegar', 'Whole Allspice Berries', 'Whole Chicken', 'Whole Coriander Seeds', 'Whole Cranberry Sauce', 'Whole Kernel Corn', 'Whole Star Anise', 'Whole Wheat Bread', 'Whole Wheat Flour', 'Whole Wheat Tortillas', 'Whole-Grain Mustard', 'Wine', 'Wine Vinegar', 'Winter Squash', 'Won Ton Wraps', 'Worcestershire Sauce', 'Wraps', 'Xanthan Gum', 'Yeast', 'Yellow Bell Pepper', 'Yellow Cake Mix', 'Yellow Onion', 'Yogurt', 'Yukon Gold Potato'];

        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += "<option>" + data[i].replace('-', ' ') + "</option>";
        }
        
        $('#ingredientSelector').html(html);
    });
}