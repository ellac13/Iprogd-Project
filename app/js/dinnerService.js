// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
dinnerPlannerApp.factory('Dinner',function ($resource,$cookies) {

    var model = this;

    this.baseImageURL = "https://spoonacular.com/recipeImages/";

    var numberOfGuests = 4; 
    var menu = [];
    var menuIds = [];

    var saveCookie = function(cookieName, object) {
        $cookies.putObject(cookieName, object);
    }

    

    this.setNumberOfGuests = function(num) {
        if (Number.isInteger(num) && num > 0) {
            numberOfGuests = num;
            saveCookie('numberOfGuests', num);
        };
    }

    this.getNumberOfGuests = function() {
        return numberOfGuests;
    }

    //Returns all the dishes on the menu.
    this.getFullMenu = function() {
        return menu;
    }

    //Returns all ingredients for all the dishes on the menu.
    this.getAllIngredients = function() {
        var ingredients = [];
        //console.log("outside for-each-loop");
        for (var key in menu) {
            //console.log("inside for-each-loop with key: " + key);
            for (var key2 in menu[key]["ingredients"]) {
                //console.log("inside inside for-each-loop with key: " + key2);
                ingredients.push(menu[key]["ingredients"][key2]);
            };
        };
        return ingredients;
    }

    //Returns the total price of a dish (all the ingredients multiplied by number of guests).
    this.getDishInMenuPrice = function(id) {
        var dish = null;
        for(var key = 0; key < menu.length; key++){
            if(menu[key]['id'] == id){
                dish = menu[key];
            }
        }

        return this.getDishPrice(dish);
    }

    this.getDishPrice = function(dish){
        if(dish == null) return -1;
        if(!('ingredients' in dish)){
            dish = convertDishDataToDishObject(dish);
        }

        var ingredients = dish['ingredients'];

        var sum = 0;
        for (var i = 0; i < ingredients.length; i++) {
            sum += ingredients[i]['price'] * ingredients[i]['quantity'] * numberOfGuests;
        };
        return parseInt(sum);
    }

    //Returns the total price of the menu (all the ingredients multiplied by number of guests).
    this.getTotalMenuPrice = function() {
        var ingredients = this.getAllIngredients();
        var sum = 0;
        for (var i = 0; i < ingredients.length; i++) {
            sum += ingredients[i]['price'] * ingredients[i]['quantity'] * numberOfGuests;
        };
        return parseInt(sum);
    }

    //Adds the passed dish to the menu. If the dish of that type already exists on the menu
    //it is removed from the menu and the new one added.
    this.addDishToMenu = function(id) {
        //Make sure that the same dish is not added twice to the menu
        for(var i = 0; i < menu.length; i++){
            if(menu[i].id == id){
                return;
            }
        }

        this.Dish.get({id:id},function(data){
            //Make sure that the same dish is not added twice to the menu
            for(var i = 0; i < menu.length; i++){
                if(menu[i].id == id){
                    return;
                }
            }
            var dish = convertDishDataToDishObject(data);
            menu.push(dish);
            menuIds.push(id);
            saveCookie('menu', menuIds);
            console.log("Successfully added dish to menu");
        },function(data){
            console.log("Failed to add dish to menu");
            alert('Failed to add dish to menu, please try again \nError code: ' + parseInt(Math.random() * 1000));
        });
    }

    //Removes dish from menu
    this.removeDishFromMenu = function(id) {
        for(var key = 0; key < menu.length; key++){
            if(menu[key]['id'] == id){
                menu.splice(key, 1);
                menuIds.splice(key, 1);
                saveCookie('menu', menuIds);
            }
        }
    }

    var convertDishDataToDishObject = function(data){
        var dishObject = [];

            dishObject.id = data.id;
            dishObject.title = data.title;
            dishObject.image = data.image;
            dishObject.description = data.instructions;

            dishObject.ingredients = [];
            for(index in data.extendedIngredients){
                var ingredientObject = {};
                ingredientObject['name'] = data.extendedIngredients[index]['name'];
                ingredientObject['quantity'] = data.extendedIngredients[index]['amount'];
                ingredientObject['unit'] = data.extendedIngredients[index]['unit'];
                ingredientObject['price'] = 1;
                dishObject.ingredients.push(ingredientObject);
            }

        return dishObject;
    }

    //function that returns the ingredients of a dish with specific ID
    this.getDishIngredients = function (id) {
      return this.getDish(id)['ingredients'];
    }


    // TODO in Lab 5: Add your model code from previous labs
    // feel free to remove above example code
    // you will need to modify the model (getDish and getAllDishes) 
    // a bit to take the advantage of Angular resource service
    // check lab 5 instructions for details


    this.DishSearch = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search',{},{
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });

    this.Dish = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/:id/information',{},{
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });

    var loadCookie = function(cookieName) {
        return $cookies.getObject(cookieName);
    }

    var loadCookies = function() {
        numberOfGuests = loadCookie('numberOfGuests');
        if (!numberOfGuests) numberOfGuests=4;
        menuIds = loadCookie('menu');
        menu = [];
        if (!menuIds){
            menuIds = [];
            return;
        }
        for (var i = 0; i < menuIds.length; i++) {
            model.addDishToMenu(menuIds[i]);
        };
    }

    loadCookies();
    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;

});