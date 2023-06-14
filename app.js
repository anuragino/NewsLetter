const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const https = require("https");
require("dotenv").config();

const app =express();
app.use(bodyParser.urlencoded({extended: true}));

//middleware  & static files
app.use('/asset',express.static('asset'));

app.post("/",function(req,res){
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;

    const data = {
        members:[
            {
                email_address: email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,

                }
            }
        ]
    };

    const jsonData =JSON.stringify(data);
    const url = process.env.URL_link;
    const options = {
        method : "POST",
        auth : process.env.MailChimp_Api_key
    }

    const request = https.request(url,options,function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started on port 3000...");
})
