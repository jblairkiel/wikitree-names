// server/index.js
import fetch from 'node-fetch';

//const express = require("express");
import express from 'express';

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });



app.get("/GetNames", (req, res) => {

    var url = "https://api.wikitree.com/api.php?action=getAncestors&key=Kiel-273"
    
    fetch(url, { // fake API endpoint
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(res => res.json())
        .then((response) => {

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            
            response = response[0].ancestors;
            var rRes = JSON.stringify(response, null, 2)
            console.log(rRes)
            res.status(200).send(rRes);
        })
        .then(data => console.log(data))
        .catch(err => {
            console.error(err);
        });

});
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});