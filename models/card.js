const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const shortid = require('shortid');

const GeneralSchema = {
    name: {
        type: Schema.Types.String
        , default: shortid.generate
    },

    content: {
        type: Schema.Types.String
        , default: ''
    },

    createTime: {
        type: Schema.Types.Date
        , default: Date.now
    }
};

const GeneralModel = new Schema(GeneralSchema);

module.exports = mongoose.model('Card', GeneralModel);