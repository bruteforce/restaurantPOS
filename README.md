This project is developed from angular seed.

There are 5 routes defined for the app :
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
            controller: 'MenuController',
            templateUrl: 'menu/addMenu.view.html',
            controllerAs: 'vm'
        })


The database for this app is right now local storage of the browser.

And for all the entities CRUD services are defined in app-services.
