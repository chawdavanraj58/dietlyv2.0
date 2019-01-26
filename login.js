var express = require("express");
var Connect = require("./Connect");
var Crypt = require("./Cryptograph");
var sequel = require("./sequel");
var session = require("express-session");



var exp = express();
var sess;


exp.set("view engine","ejs");
exp.use('/assets', express.static("assets"));
var bodyParser = require('body-parser');

/**express uses */
exp.use(session({
    secret: 'elpsycongroo',
    resave: false,
    saveUninitialized: false
}));
exp.use(bodyParser.json()); 
exp.use(bodyParser.urlencoded({ extended: true })); 
/**express uses */

var mysql = require("mysql");

Connect.tryConnect();

exp.get("/",function(req,res)
{

    console.log(sess);
    if(sess != undefined)
    {
       
        console.log(sess.username);
        res.render("homepage",{loginid: sess.username});
    }
    else
    {
        res.render("homepage",{loginid: ""});
    }
})



/** for signup form */
exp.get("/signup",function(req,res)
{
    console.log("in signup");
    res.render("forms");
});
/** for signup from */

/**for chooseplan */
exp.get("/chooseplan",function(req,res)
{
    console.log("in signup");
    res.render("chooseplan");
});

/**for login get */
exp.get("/login",function(req,res)
{
    console.log("in signup");
    res.render("dietlogin");
});


/** for login */
exp.post("/login",function(req,res)
{
     var uname = req.body.username;
    var pass1 = req.body.password;
    var pass;
    var done = true;
    var totalrows;

    var encryptpromise = new Promise( function (resolve,reject)
    {

        Crypt.encrypto(pass1,function(data)
        {
            pass = data;
            console.log(pass);
            resolve(pass);
        });

    });

    encryptpromise.then(function(pass){ 
    var promise = new Promise(function(resolve,reject)
    {

        console.log("in promise")
        Connect.validate(uname,pass,function(data)
        {
         totalrows = data.length;
         console.log(data);
         resolve(totalrows);
        });
    });


    promise.then(
    function(totalrows)
    {
        console.log(totalrows); 
        console.log("in promise responder");
        if(totalrows != 1)                              //results.length - to find no of rows 
        {
        console.log("Invalid User");
        
        res.render("login",{message: "Invalid User"});
        }

        else
        {
            console.log("in afterlogin");
            res.render("afterlogin",{loginid: req.body.username});
            sess = req.session;
            sess.username = req.body.username;
            console.log(sess);
        }
    }   
    );

});
});
/**for login */

/**for signup Post */

exp.post("/signup",function(req,res)
{
    var uname = req.body.username;
    var pass1 = req.body.password;
    var pass;
    var Status1;
    console.log("in signup")

    var encryptpromise = new Promise( function (resolve,reject)
    {

     Crypt.encrypto(pass1,function(data)
     {
            pass = data;
            resolve(pass);
     });

    });

    encryptpromise.then(function(pass){    
    var promiseins = new Promise(function(resolve,reject)
    {

        sequel.insertuser(req,pass,function(data)
        {
            Status1 = data.username;
            console.log(Status1);
            resolve(Status1) ;
        })
    });  

    promiseins.then(
        function(Status1)
        {
            if(Status1 != "")
            {
                res.render("homepage",{loginid: ""});
                console.log("registration complete");

            }
            else
            {
                res.send ("Account is already created");
            }
        }
    );
 });
   
});

/**for signUp Post */

/** for plan selected */
exp.get("/planselected",function(req,res){

    var now = new Date();
    var mealStatus;
    var count = 0;
    console.log("in plan selected");
    console.log(sess.username);
    if(sess.username)
    {
        var lmealpromise = new Promise(function(resolve,reject) /**promise is no defineed error come because of small p */
        {
            var plantime = req.query.plantime;
            for(i = 0;i < plantime;i++)
            {
            now.setDate(now.getDate() + 1);
            sequel.insertmeals(req,sess.username,now,function(data){
            mealStatus = data;
            count ++ ;
            });
           
            }
            resolve(count); 
        });

        lmealpromise.then(function(count){
            console.log(count);
            console.log("lmeal promise completed");
            sess.plan = 1;
            console.log(sess);
            res.render("afterlogin",{loginid: sess.username});
        });
        
    }
});

exp.get("/presentplans",function(req,res)
{
    console.log("in present plans");
    var result;
    if(sess.username)
    {
        
            var allplanspromise = new Promise(function(resolve,reject)
            {
                console.log("allplanspromise - sending plans");
                sequel.getallmeals(sess.username,function(data)
                {
                    console.log("allplanspromise - plans received");
                     result = data;
                     resolve(result);
                });
            });
            
            allplanspromise.then( function(result)
            {
                
                console.log("in allplanspromise reponder");
                console.log(result);
                res.send(result);
            });
        
    }

});

exp.get("/lupdate",function(req,res){

    console.log("in /lupdate plans");
if(sess.username)
    {
    var lunchupdatepromise = new Promise(function(resolve,reject)
    {
        console.log("lunchupdatepromise - sending plans");
        sequel.lunchupdatemeals(sess.username,req,function(data)
        {
            console.log("lunchupdatepromise - update complete");
             result = data;
             resolve(result);
        });
    });
    
    lunchupdatepromise.then( function(result)
    {
        
        console.log("in lunchupdatepromise reponder");
        console.log(result);
        res.render("afterlogin",{loginid: sess.username});
    });

    }
    
});

exp.get("/lunchplans",function(req,res)
{
    console.log("in present plans");
    var result;
    if(sess.username)
    {
        
            var allplanspromise = new Promise(function(resolve,reject)
            {
                console.log("lunchplanspromise - sending plans");
                sequel.getlunchmeals(sess.username,function(data)
                {
                    console.log("allplanspromise - plans received");
                     result = data;
                     resolve(result);
                });
            });
            
            allplanspromise.then( function(result)
            {
                
                console.log("in allplanspromise reponder");
                console.log(result);
                res.send(result);
            });
        
    }

});

exp.get("/dinnerplans",function(req,res)
{
    console.log("in present plans");
    var result;
    if(sess.username)
    {
        
            var allplanspromise = new Promise(function(resolve,reject)
            {
                console.log("lunchplanspromise - sending plans");
                sequel.getdinnermeals(sess.username,function(data)
                {
                    console.log("allplanspromise - plans received");
                     result = data;
                     resolve(result);
                });
            });
            
            allplanspromise.then( function(result)
            {
                
                console.log("in allplanspromise reponder");
                console.log(result);
                res.send(result);
            });
        
    }

});

exp.get("/brupdate",function(req,res){

    console.log("in /brupdate plans");
if(sess.username)
    {
    var breakfastupdatepromise = new Promise(function(resolve,reject)
    {
        console.log("breakfastupdatepromise - sending plans");
        sequel.breakfastupdatemeals(sess.username,req,function(data)
        {
            console.log("breakfastupdatepromise - update complete");
             result = data;
             resolve(result);
        });
    });
    
    breakfastupdatepromise.then( function(result)
    {
        
        console.log("in breakfastupdatepromise reponder");
        console.log(result);
        res.render("afterlogin",{loginid: sess.username});
    });

    }
    
});

/** for plan selected */

exp.listen(5858);
console.log("listening");