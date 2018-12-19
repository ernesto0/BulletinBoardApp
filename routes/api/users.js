const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const User = require('../../models/User');

router.get('/test', (req, res) => res.json({msg: "Users works"}));


//@route    POST api/users/register
//@desc     Register user
//@access   Public    
router.post('/register', (req,res) =>{
    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email: 'An account with this email already exists'});
        } else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err,hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
})

//@route    POST api/users/login
//@desc     Login User / returns jwt
//@access   Public  
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({email})
        .then(user => {
            //check if user exists
            if(!user){
                return res.status(404).json({email: 'User not found'});
            }

            //Authenticate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    //password is correct
                    if(isMatch){
                       //create payload
                       const payload = { id: user.id, name: user.name }
                       
                       //sign token
                       jwt.sign(payload, keys.secretOrKey, {expiresIn: 86400}, (err, token)=>{
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                       });
                    }
                    else{
                        return res.status(400).json({ password: 'password incorrect'});
                    }
                })
                
        })
})
module.exports = router;