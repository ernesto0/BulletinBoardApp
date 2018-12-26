const Validator = require('validator');
const isEmpty =  require('./is-empty');

module.exports = function validateLoginInput(data, auth){
    let errors = {};

    data.startTime = !isEmpty(data.startTime) ? data.startTime: '';
    data.desc = !isEmpty(data.desc) ? data.desc: '';
    data.org = !isEmpty(data.org) ? data.org: '';


    // if(Validator.isEmpty(data.startTime)){
    //     errors.startTime = 'Start Time field is required';
    // }

    if(Validator.isEmpty(data.desc)){
        errors.desc = 'Event description field is required';
    }

    if(Validator.isEmpty(data.org)){
        errors.org = 'Organizaiton field is required';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };

}