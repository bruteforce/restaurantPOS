This project is developed from angular seed.
There are 5 routes defined for this single page app :
.when('/login', {
          controller: 'LoginController',
          templateUrl: 'login/login.view.html',
          controllerAs: 'vm'
        })

        .when('/register', {
          controller: 'RegisterController',
          templateUrl: 'register/register.view.html',
          controllerAs: 'vm'
        })

        .when('/manageMenu', {
                  controller: 'MenuController',
                  templateUrl: 'menu/addMenu.view.html',
                  controllerAs: 'vm'
                })

        .when('/manageRestaurant', {
                    controller: 'RestaurantController',
                    templateUrl: 'restaurant/addRestaurant.view.html',
                    controllerAs: 'vm'
        })


The database for this app is right now local storage of the browser.

And for all the entities CRUD services are defined in app-services.

You can test the app by following the url: https://dl.dropboxusercontent.com/u/82903516/app/index.html#/login
