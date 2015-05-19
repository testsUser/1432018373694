(function ()
{
    'use strict';
    var mongoose = require('mongoose-q')();
    var phoneSchema = new mongoose.Schema({
        model: String,
        brand: String,
        stan: {type: String, enum: ['Used', 'New']}
    }, {
        collection: 'phones'
    });
    var Model = mongoose.model('phones', phoneSchema);

    function createNewOrUpdate(phone)
    {
        var filter = {_id: phone._id || null};
        return Model.findOneAndUpdateQ(filter, phone, {upsert: true}).then(function (result)
        {
            return {results: result};
        });
    }

    function search(query)
    {
        var pattern = query.query || '';
        var filter = { $or: [
            {model: {$regex: pattern, $options: 'i'}},
            {brand: {$regex: pattern, $options: 'i'}},
            {stan: {$regex: pattern, $options: 'i'}}
        ]};
        return Model.findQ(filter).then(function (result)
        {
            return {results: result};
        });
    }

    function getDetails(phoneId)
    {
        return Model.findOneQ({_id: phoneId}).then(function (result)
        {
            return {results: result};
        });
    }

    function removePhone(phoneId)
    {
        return Model.findOneAndRemoveQ({_id: phoneId});
    }

    module.exports = {
        removePhone: removePhone,
        getDetails: getDetails,
        createNewOrUpdate: createNewOrUpdate,
        search: search,
        schema: phoneSchema
    };
})();
