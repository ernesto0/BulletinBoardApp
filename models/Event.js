const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema ({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    attendees: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        default: undefined
    },
    org: {
        type: Schema.Types.ObjectId,
        ref: 'orgs',
        required: true
    }
})

module.exports = Event = mongoose.model('events', EventSchema);