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
    
    const id = req.query.name;
    if (id == ' '){
        res.status(200).send([]); 
        return;
    } 
    console.log(id);
    //var url = "https://api.wikitree.com/api.php?action=getAncestors&key=Thomas-50033&depth=10"
    var url = "https://api.wikitree.com/api.php?action=getAncestors&key=" + req.query.name + "&depth=" + req.query.levels
    //var url = "https://api.wikitree.com/api.php?action=getAncestors&key=Kiel-273"
    
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
            
            if (response[0].status == "Illegal WikiTree ID"){
                res.status(200).send(JSON.stringify([]));
            } else {
                response = response[0].ancestors;
                var rRes = JSON.stringify(response, null, 2)
                console.log(rRes)
                res.status(200).send(rRes);
            }
        })
        .then(data => console.log(data))
        .catch(err => {
            console.error(err);
        });

});
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});