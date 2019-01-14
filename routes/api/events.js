const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.set('useFindAndModify', false);

//Event model
const Event = require('../../models/Event');
const Org = require('../../models/Org');

//Validation
const validateEventInput = require('../../validation/event');

router.get('/test', (req, res) => res.json({msg: "profile works"}));


//@route    POST    api/events
//@desc     Create  event. In order to create an event the user must be an org admin
//@access   Private 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    // const {errors, isValid} = validateEventInput(req.body);
    
    
    // Check input validation
    // if(!isValid){
    //     return res.status(400).json(errors);
    // }

    //check if org exists & user is an admin of the event's org
    Org.findOne({name: req.body.org})
    .then(org => {
        //check if org exists
        if(!org){
            errors.org = 'organization does not exist';
            return res.status(404).json(errors);
        }
        //check if user is an admin of org
        Org.findOne({admins: req.user.id}), (err, org1) => {
            if(!org1){
                //user is not an admin
                errors.admin = 'User is unauthorized to add events';
                return res.status(403).json(errors);
            }
        };
        const newEvent = new Event({
            //add event time
            desc : req.body.desc,
            org : req.body.org,
            user: req.user.id,
            name: req.body.name
        });
    
        newEvent.save().then(event => res.json(event));

    })
        
});

//@route    POST    api/events/edit
//@desc     Edit  event. In order to edit an event the user must be an org admin
//@access   Private 
router.post('/edit', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const errors = {};
    //check if org exists & user is an admin of the event's org
    Event.findById(req.body.id)
    .then(event =>{
        console.log(event);
        const newEvent = {
            name : req.body.name,
            desc : req.body.desc,
        };
        event.updateOne(newEvent).then(res.json(newEvent));
    })
    .catch(err => res.status(404).json({eventNotFound: 'No event found with given ID'}));
});

//@route    POST    api/events/rsvp
//@desc     Add user to attendees array of an event
//@body     eventID
//@access   PRIVATE
router.post('/rsvp', passport.authenticate('jwt',{ session: false}), (req, res) => {
    const errors = {};
    Event.findById(req.body.eventID)
    .then(event => {
        event.attendees.push(req.user.id);
        return res.json(event);
    })
    .catch(err => res.status(404).json({eventNotFound: 'Event not found'}));
});

//@route    GET     api/events/
//@desc     Get     events
//@access   Public 
router.get('/', (req, res) => {
    Event.find()
    .sort({startTime: 1})
    .then(events => res.json(events))
    .catch(err => res.status(404).json({nopostsfound : 'No posts found'}));
});

//@route    GET     api/events/:org
//@desc     Get event by org
//@access   Public 
router.get('/:org', (req, res) => {
    Event.find({name: req.params.org})
    .then(events => res.json(events))
    .catch(err => res.status(404).json({nopostfound: 'No events'}));
});

//@route    GET     api/events/:id
//@desc     Get event by id
//@access   Public 
router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
    .then(events => res.json(events))
    .catch(err => res.status(404).json({nopostfound: 'No post found with given ID'}));
});

//@route    POST    api/events/edit
//@desc     Edit event. In order to edit an event the user must be an org admin
//@access   Private 

//@route    Delete    api/events/:id
//@desc     Delete event. In order to delete an event the user must be an org admin
//@access   Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Event.findOne({user: req.user.id})
    .then(event => {
        Event.findById(req.params.id)
        .then((post) => {
            if(event.user.toString() !== req.user.id) {
                return res.status(401).json({ notauthorized: 'User not authorized'})
            }

            event.remove().then(() => res.json({ success: true}));
        })
        .catch(err => res.status(404).json({eventNotFound: 'No event found'}))
    })
});

module.exports = router;