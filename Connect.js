var express = require("express");


var mysql = require("mysql");

var conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "test"
    
});

var tryConnect = function(){
    conn.connect();
}

var validate = function(uname,pass,callback)
{
    
    console.log("in validate");
    console.log(pass);
    console.log(uname);
    var sql =  conn.query("select * from users where username = ? and password = ?",[uname,pass],function(err,data)   //learned from npm myssql package
    {
        console.log("yes query fired");
        if(err)
        {
            console.log("Error aa gayi");
        }
        else
        {
            console.log(data.length);
            console.log(data);
            callback(data);
         }
    })
}

var insertuser = function(uname,pass,callback)
{
    console.log("about to fire query")
    console.log(uname);
    console.log(pass);
    var sqlins = conn.query("insert into validate(username,password) values (?,?)",[uname,pass],function(err,data)
    {
        if(err)
        {
            console.log("Error aa gayi");
        }
        else{
            console.log(data);
            callback(data);
        }
    })
}


module.exports.conn = conn;
module.exports.tryConnect = tryConnect;
module.exports.validate = validate;
module.exports.insertuser = insertuser;