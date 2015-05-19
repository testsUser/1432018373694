(function () {
    'use strict';

    function BrainCandyListCtrl(CandyDAO) {
        var ctrl = this;

        ctrl.deleteCandy = function (id)
        {
            CandyDAO.remove(id).then(function ()
            {
                refresh();
            })
        };

        var refresh = function ()
        {
            CandyDAO.query().then(function (data) {
                ctrl.brainCandies = data;
            });
        };

        refresh();
    }

    var module = angular.module("exerciseApp");
    module.controller('BrainCandyListCtrl', ['CandyDAO', BrainCandyListCtrl]);
})();
