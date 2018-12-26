const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Event model
const Event = require('../../models/Event');

//Validation
const validateEventInput = require('../../validation/event');

router.get('/test', (req, res) => res.json({msg: "profile works"}));


//@route    POST    api/events
//@desc     Create  event
//@access   Private 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const {errors, isValid} = validateEventInput(req.body);
    
    //Check validation
    if(!isValid){
        //if errors in input, send 400 status with errors object
        return res.status(400).json(errors);
    }

    const newEvent = new Event({
        startTime : req.body.startTime,
        endTime : req.body.endTime,
        desc : req.body.desc,
        org : req.body.org
    });

    newEvent.save().then(post => res.json(post));
});

module.exports = router;