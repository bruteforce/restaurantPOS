(function () {
    'use strict';

    angular
        .module('app')
        .factory('ItemService', ItemService);

    ItemService.$inject = ['$timeout', '$filter', '$q'];
    function ItemService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByItemname = GetByItemname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getItems());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getItems(), { id: id });
            var item = filtered.length ? filtered[0] : null;
            deferred.resolve(item);
            return deferred.promise;
        }

        function GetByItemname(itemname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getItems(), { itemname: itemname });
            var item = filtered.length ? filtered[0] : null;
            deferred.resolve(item);
            return deferred.promise;
        }

        function Create(item) {
            var deferred = $q.defer();

            // simulate api call with some timeout
            $timeout(function () {
                GetByItemname(item.itemname)
                    .then(function (duplicateItem) {
                        if (duplicateItem !== null) {
                            deferred.resolve({ success: false, message: 'Itemname "' + item.itemname + '" is already taken' });
                        } else {
                            var items = getItems();

                            // assign id
                            var lastItem = items[items.length - 1] || { id: 0 };
                            item.id = lastItem.id + 1;

                            // save to local storage
                            items.push(item);
                            setItems(items);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(item) {
            var deferred = $q.defer();

            var items = getItems();
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    items[i] = item;
                    break;
                }
            }
            setItems(items);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var items = getItems();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id === id) {
                    items.splice(i, 1);
                    break;
                }
            }
            setItems(items);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getItems() {
            if(!localStorage.items){
                localStorage.items = JSON.stringify([]);
            }

            return JSON.parse(localStorage.items);
        }

        function setItems(items) {
            localStorage.items = JSON.stringify(items);
        }
    }
})();