const FormatProductrObj = (productObj) => {
    const obj = {};
    obj.Name=productObj.Name;
    obj.price = productObj.price;
 
    obj.quantity = productObj.quantity;
  
    obj.avatar=productObj.avatar;
   

    return obj;
};

module.exports = {
    FormatProductObj
};