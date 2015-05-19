(function () {
    'use strict';

    function BrainCandyDetailsCtrl($routeParams, CandyDAO) {
        var ctrl = this;

        ctrl.saveCandy = function ()
        {
            CandyDAO.save(ctrl.details);
        };

        var refresh = function ()
        {
            CandyDAO.get($routeParams.id).then(function (data) {
                ctrl.details = data;
            });
        };

        refresh();
    }

    var module = angular.module("exerciseApp");
    module.controller('BrainCandyDetailsCtrl', ['$routeParams', 'CandyDAO', BrainCandyDetailsCtrl]);
})();
