'use strict';

angular.module('taskApp').factory('patchModel', function ($http)
{
    var endpointGlobal = null;
    var ignoreListGlobal = null;
    var objectIdGlobal = null;
    var callbackGlobal = null;

    function api(endpoint)
    {
        endpointGlobal = endpoint;
        return methods;
    }

    function id(id)
    {
        objectIdGlobal = id;
        return methods;
    }

    function ignore(ignore)
    {
        ignoreListGlobal = ignore;
        return methods;
    }

    function callback(callback)
    {
        callbackGlobal = callback;
        return methods;
    }

    function factory(object, scope)
    {
        scope.$watch(function ()
        {
            return object;
        }, function (newVal, value)
        {
            if (newVal === value || (!endpointGlobal && !callbackGlobal)) {
                return;
            }

            var observer = jsonpatch.observe(value, null);
            angular.extend(value, newVal);
            var patch = jsonpatch.generate(observer);
            var finalPatch = [];

            if (ignoreListGlobal) {
                angular.forEach(patch, function (element)
                {
                    angular.forEach(ignoreListGlobal, function (string)
                    {
                        if (-1 === element.path.indexOf(string)) {
                            finalPatch.push(element)
                        }
                    })
                });
            } else {
                finalPatch = patch;
            }

            if (finalPatch.length) {
                if (endpointGlobal) {
                    var request = {
                        method: 'PATCH',
                        url: endpointGlobal + '/' + (objectIdGlobal || value.id),
                        data: finalPatch
                    };
                    $http(request);
                } else if (callbackGlobal) {
                    callbackGlobal(finalPatch);
                }
            }

            jsonpatch.unobserve(value, observer);
        }, true);

        return methods;
    }

    var methods = {
        api: api,
        ignore: ignore,
        id: id,
        callback: callback
    };

    return factory;
});
