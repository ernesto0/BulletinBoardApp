const Validator = require('validator');
const isEmpty =  require('./is-empty');

module.exports = function validateLoginInput(data, auth){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name: '';
    data.desc = !isEmpty(data.desc) ? data.desc: '';

    if(Validator.isEmpty(data.name)){
        errors.name = 'Organization name field is required';
    }

    if(Validator.isEmpty(data.desc)){
        errors.desc = 'Organization description field is required';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };

}