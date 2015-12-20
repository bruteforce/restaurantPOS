(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['ItemService', '$location', '$rootScope', 'FlashService'];
    function MenuController(ItemService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.addItem = addItem;

        function addItem() {
            vm.dataLoading = true;
            ItemService.Create(vm.item)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Item added successful', true);
                        $location.path('/showMenu');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();