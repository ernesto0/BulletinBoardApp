const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

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
    const {errors, isValid} = validateEventInput(req.body);
    
    //Check input validation
    if(!isValid){
        return res.status(400).json(errors);
    }

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
            user: req.user.id
        });
    
        newEvent.save().then(event => res.json(event));

    })
    
});

module.exports = router;