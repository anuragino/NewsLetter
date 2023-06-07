const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const https = require("https");

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
    const url = "https://us11.api.mailchimp.com/3.0/lists/2614cd1641";
    const options = {
        method : "POST",
        auth : "anurag1:35a75ff21243cb0e58e45512097a3a7e-us11"
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


// api key
//  35a75ff21243cb0e58e45512097a3a7e-us11

// list id  2614cd1641