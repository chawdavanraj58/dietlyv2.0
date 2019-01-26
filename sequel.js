var Sequelize = require("sequelize");
var moment = require("moment");

var connection = new Sequelize('test','root','root', /**constructor creates object  */ 
{
dialect : 'mysql' ,/**mysql2 npm is necessary */
operatorsAliases : false    /**why i did this?? */ /**cause string based were deprecated */
});  



var Users = connection.define('users',{
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: { 
        type: Sequelize.TEXT,
        allowNull: false
    },
    activation: {
        type: Sequelize.BOOLEAN,
    },

   
      /**cause text is unlimited check in sequelize's documentation */
});






var MandatoryDetails = connection.define('MandatoryDetails',{
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: { 
        type: Sequelize.TEXT,                              /**to save data of sign-up */
        allowNull: false
    },
    name: { 
        type: Sequelize.TEXT,
        allowNull: false
    },

    phone: { 
        type: Sequelize.BIGINT,
        allowNull: false
    },
});

var Breakfasttable = connection.define('BreakfastTable',{
   
    beggs: { 
        type: Sequelize.INTEGER,                              /**to save data of sign-up */
        allowNull: true
    },
    bjuice: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    bsalad: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    deliverydate: {
        type: Sequelize.DATE,
        allowNull: false,
        get: function() {
            return moment.utc(this.getDataValue('CreateDate')).format('YYYY-MM-DD')
        }
    }


});

Users.hasMany(Breakfasttable, {foreignKey: 'username'});



var lunchtable = connection.define('lunchtables',{
   
    leggs: { 
        type: Sequelize.INTEGER,                              /**to save data of sign-up */
        allowNull: true
    },
    lmeat: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    lsalad: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    deliverydate: {
        type: Sequelize.DATE,
        allowNull: false
    }


});

Users.hasMany(lunchtable, {foreignKey: 'username'});

var dinnertable = connection.define('dinnertables',{
   
    deggs: { 
        type: Sequelize.INTEGER,                              /**to save data of sign-up */
        allowNull: true
    },
    dmeat: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    dsalad: { 
        type: Sequelize.INTEGER,
        allowNull: true
    },

    deliverydate: {
        type: Sequelize.DATE,
        allowNull: false
    }

});
Users.hasMany(dinnertable, {foreignKey: 'username'});


var insertuser = function(req,pass,callback)
{
    console.log("in sequel");
    connection.sync().then(function()
    {
        console.log("in sync");
        MandatoryDetails.create({
            username:req.body.username,
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone
        }).catch(function(err)
        {
           var eror = "";
             callback(eror);
        });

        Users.create({
        username: req.body.username,
        password: pass,
        activation: req.body.activation
         }).then(function(result)
         {
             console.log(result.username);
             callback(result);
         }).catch(function(err)
         {
            var eror = "";
           callback(eror);
         });
    }); /** 1.connect to database ,2. generates sequel */
}    

var insertmeals = function(req,uname,now,callback)
{
    console.log ("in sequel insert meal");
    var mydate = new Date();
    console.log(now);
    mydate = now;
    // var plantime = req.query.plantime;*/
    
    /** var smealpromise = new Promise(function(resolve,reject)
    // { *
        /** for(i = 0;i < plantime;i++)
        { */
            
             connection.sync().then(function()
             {
               /**  now.setDate(now.getDate() + 1);*/
                connection.transaction(function(t)
                {
                    Breakfasttable.create({
                            beggs: req.query.begg,
                            bjuice: req.query.bjuice,
                            bsalad: req.query.bsalad,
                            deliverydate: mydate,
                            username:uname
                        },{transaction: t});
                     lunchtable.create({
                            leggs: req.query.legg,
                            lmeat: req.query.lmeat,
                            lsalad: req.query.lsalad,
                            deliverydate: mydate,
                            username:uname
                        },{transaction: t}); 
                    return dinnertable.create({
                            deggs: req.query.degg,
                            dmeat: req.query.dmeat,
                            dsalad: req.query.dsalad,
                            deliverydate: mydate,
                            username:uname
                        },{transaction: t});                 
                }).then(function(result){
                    console.log("in insert meal's third stage");
                    callback(result);
                });;
            
            });
        /** var result = 1;
        console.log("just before completing smealpromise");
        resolve(result);*/
      
}

var getallmeals = function(uname,callback)
{
    
        Breakfasttable.findAll({
            raw: true,
            attributes: [ 'id','beggs', 'bjuice', 'bsalad', 'deliverydate'],
            where: {
              username: uname
            }
          }).then(function(result)
          {
            console.log(result);
            callback(result);
          });
    
}

var getlunchmeals = function(uname,callback)
{
    
        lunchtable.findAll({
            raw: true,
            attributes: [ 'id','leggs', 'lmeat', 'lsalad', 'deliverydate'],
            where: {
              username: uname
            }
          }).then(function(result)
          {
            console.log(result);
            callback(result);
          });
    
}

var getdinnermeals = function(uname,callback)
{
    
        dinnertable.findAll({
            raw: true,
            attributes: [ 'id','deggs', 'dmeat', 'dsalad', 'deliverydate'],
            where: {
              username: uname
            }
          }).then(function(result)
          {
            console.log(result);
            callback(result);
          });
    
}

var breakfastupdatemeals = function(uname,req,callback)
{
    console.log(req);
    var orderid =  req.query.orderid;
    
    var eggs = req.query.beggs;
    var juice = req.query.bjuice;
    var salad = req.query.bsalad;
    var deldate = req.query.bdeliverydate;
    console.log(eggs,juice,salad,deldate);
    Breakfasttable.update({
        beggs: eggs,
        bjuice: juice,
        bsalad: salad,
        deliverydate: deldate
    },
        {where: {
          username: uname,
          id: orderid
        }
      }).then(function(result)
      {
        console.log(result);
        callback(result);
      });

}

var lunchupdatemeals = function(uname,req,callback)
{
    console.log(req);
    var orderid =  req.query.orderid;
    
    var eggs = req.query.leggs;
    var meat = req.query.lmeat;
    var salad = req.query.lsalad;
    var deldate = req.query.ldeliverydate;
    console.log(eggs,meat,salad,deldate);
    lunchtable.update({
        leggs: eggs,
        lmeat: meat,
        lsalad: salad,
        deliverydate: deldate
    },
        {where: {
          username: uname,
          id: orderid
        }
      }).then(function(result)
      {
        console.log(result);
        callback(result);
      });

}



module.exports.insertuser = insertuser;
module.exports.insertmeals  = insertmeals;
module.exports.getallmeals  = getallmeals;
module.exports.getlunchmeals  = getlunchmeals;
module.exports.getdinnermeals  = getdinnermeals;
module.exports.lunchupdatemeals  = lunchupdatemeals;
module.exports.breakfastupdatemeals  = breakfastupdatemeals;
