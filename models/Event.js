const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema ({
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        img: { data: Buffer, contentType: String}
    },
    attendees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    org: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

module.exports = Event = mongoose.model('events', EventSchema);