const express = require("express");
const parse = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const app = express();

app.use(parse.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running ");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){

    var name =req.body.Name;  
    var email=req.body.email;

    var data ={
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields :{
                    FNAME : name
                }
            }

        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/562bca702a";
    const options={
        method : "POST",
        auth : "Kirubhakar:f266697da7f496aa85404c9c84baf538-us20"
    }

     const request = https.request(url,options,function(response){
        
        
        response.on("data",function(data){
        console.log(JSON.parse(data),response.statusCode);
        if(response.statusCode === 200 && JSON.parse(data).error_count===0)
        {
            if(JSON.parse(data).total_created===1){
            res.sendFile(__dirname+"/success.html");
            }
            else
            {
            res.sendFile(__dirname+"/failure.html");
            }
        }
        else if(JSON.parse(data).error_count===1)
        {
            if(JSON.parse(data).errors[0].error_code === "ERROR_CONTACT_EXISTS"){
                res.sendFile(__dirname+"/existinguser.html");
            }
            else
            {
            res.sendFile(__dirname+"/failure.html");
            }
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
            //console.log(response.statusCode,response.body.error_count)

        }
           
        });
    });

    request.write(jsonData);

    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
});

