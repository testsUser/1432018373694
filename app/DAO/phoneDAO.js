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
        if (!phone._id) {
            //    create
            return new Model(phone).saveQ().then(function (result)
            {
                return {results: result};
            });
        } else {
            //update
            var id = phone._id;
            delete phone._id;
            return Model.where('_id').equals(id).findOneAndUpdateQ(phone).then(function (results)
            {
                return {results: results};
            });
        }
    }

    function search(query)
    {
        var pattern = query.query || '';
        var filter = { $or: [
            {model: {$regex: pattern, $options: 'i'}},
            {brand: {$regex: pattern, $options: 'i'}},
            {stan: {$regex: pattern, $options: 'i'}}
        ]};
        var sort = {};
        sort[query.sortBy || '_id'] = query.orderBy ? query.orderBy.toLowerCase() : 'asc';
        var skip = parseInt(query.skip, 10) || 0;
        var limit = parseInt(query.limit, 10) || 1;

        return Model.find(filter).count().execQ().then(function (total)
        {
            return Model.aggregate().match(filter).sort(sort).skip(skip).limit(limit).execQ().then(function (result)
            {
                return {results: result, total: total};
            });
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
        return Model.findByIdAndRemoveQ(phoneId);
    }

    module.exports = {
        removePhone: removePhone,
        getDetails: getDetails,
        createNewOrUpdate: createNewOrUpdate,
        search: search,
        schema: phoneSchema
    };
})();
