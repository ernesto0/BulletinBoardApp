const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Org = require('../../models/Org');

//Validation
const validateOrgInput = require('../../validation/org');


//@route    POST    api/orgs
//@desc     Create  org.
//@access   Private 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const {errors, isValid} = validateOrgInput(req.body);

    //Check input validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Check if org already exists.
    Org.findOne({name: req.body.name})
    .then(org =>{
        if(!org){
            const newOrg = new Org({
                name : req.body.name,
                desc : req.body.desc,
                admins : req.user.id
            })

            newOrg.save().then(org1 => res.json(org1));
        }
        else{
            errors.org = 'Organization already exists';
            return res.json(errors);
        }
    })
});

//@route    POST    api/orgs/edit
//@desc     Edit existing org.
//@access   Private 
router.post('/edit', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const {errors, isValid} = validateOrgInput(req.body);

    //Check input validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    // //Check if org already exists.
    // Org.findOneAndUpdate(
    //     {"name": req.body.name},
    //     {$set: {"name" : req.body.newName, 
    //             "desc": req.body.desc}}).then(org => res.json(org));
    
    Org.findOne({name: req.body.name})
    .then(org =>{
        if(org){
            console.log(org);
            const newOrg = {
                name : req.body.newName,
                desc : req.body.desc,
            };
            org.updateOne(newOrg).then(res.json({Success: 'Organization update successful'}));
        }
        else{
            errors.org = 'You cannot edit an organization that does not exist';
            return res.json(errors);
        }
    });
    
});

//@route    POST    api/orgs
//@desc     Create  org.
//@access   Private 
router.post('/admin', passport.authenticate('jwt', {session: false}), (req, res) =>{
    // const {errors, isValid} = validateOrgInput(req.body);

    // //Check input validation
    // if(!isValid){
    //     return res.status(400).json(errors);
    // }

    //Check if org already exists.
    Org.findOne({name: req.body.org})
    .then(org =>{
        if(!org){
            const newOrg = new Org({
                name : req.body.name,
                desc : req.body.desc,
                admins : req.user.id
            })

            newOrg.save().then(org1 => res.json(org1));
        }
        else{
            errors.org = 'Organization already exists';
            return res.json(errors);
        }
    })
});

//@route    GET     api/orgs/
//@desc     Get     orgs
//@access   Public 
router.get('/', (req, res) => {
    Org.find()
    .sort({name: -1})
    .then(orgs => res.json(orgs))
    .catch(err => res.status(404).json({noOrgsFound : 'No organizations found'}));
});

//@route    GET     api/orgs/:id
//@desc     Get org by id
//@access   Public 
router.get('/:id', (req, res) => {
    Org.findById(req.params.id)
    .then(orgs => res.json(orgs))
    .catch(err => res.status(404).json({orgNotFound: 'No org found with given id'}));
});

//@route    Delete    api/orgs/:id
//@desc     Delete org. In order to delete an org the user must be an org admin
//@access   Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //find org
    Org.findById(req.params.id)
    .then(org => {
        //check if user is authorized to delete org
        if(org.admins.includes(req.user.id)) {
            return res.status(401).json({ notauthorized: 'User not authorized'})
        }

        org.remove().then(() => res.json({ success: true}));
    })
    .catch(err => res.status(404).json({orgNotFound: 'Org not found'}))
});

module.exports = router;