const crypto = require('crypto');


/** for encryption */
var encrypto = function(variable1,callback)
{
    var mystr;
    var promise =new Promise( function(resolve,reject)
    { 
        const mystr = crypto.createHmac('sha256', "elpsycongroo")  
        .update(variable1)  
        .digest('hex');  
    

    resolve(mystr);
    });
    
    promise.then(function(mystr)
    {
        console.log(mystr);
        callback(mystr);
    });


};


/** for decryption which won't work cause encryption is learnt from different site */
var Decrypt = function(variable1,callback)
{
    var mystr;
    var promise =new Promise( function(resolve,reject)
    { 
        var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
        mystr = mykey.update('34feb914c099df25794bf9ccb85bea72', 'hex', 'utf8')
        mystr += mykey.update.final('utf8');

    resolve(variable1);
    });
    
    promise.then(function(variable1)
    {
        console.log(mystr);
        callback(mystr);
    });


};



module.exports.encrypto = encrypto;
module.exports.Decrypt = Decrypt;
