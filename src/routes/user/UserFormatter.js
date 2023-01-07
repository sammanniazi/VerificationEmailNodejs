const FormateUserObj = (userObj) => {
    const obj = {};
    obj.id = userObj.id;
 
    obj.email = userObj.email;
   

    return obj;
};

module.exports = {
    FormateUserObj
};