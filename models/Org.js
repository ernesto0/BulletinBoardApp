const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrgSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    image: {
        img: { data: Buffer, contentType: String}
    },
    members:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    admins:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    events:[
        {
            type: Schema.Types.ObjectId,
            ref: 'events',
            default: undefined
        }
    ],
    contact:{
        type: String,
        required: false
    }
})

module.exports = Org = mongoose.model('orgs', OrgSchema);