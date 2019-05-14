var mysql = require('mysql');
const cors = require('cors')({origin: true});
const express = require('express')
const server_side = express()
const port = process.env.PORT || '8080';
const bodyParser = require('body-parser');

const axios = require('axios')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

server_side.use(allowCrossDomain);
server_side.use(bodyParser.urlencoded({ extended: false }));
server_side.use(express.json());
server_side.use(express.urlencoded());
server_side.use(bodyParser.json());

server_side.get('/signUpUsers', (req, res) => {
    console.log("Connected!");
    const user = req.query;
    axios.post('https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app/users', {
        user
    })
        .then((res) => {
            console.log(`statusCode: ${res.statusCode}`)
        })
        .catch((error) => {
            console.error(error)
        })

});
server_side.post('/signUpGardens', (req, res) => {
    console.log("Connected!");
    const garden = req.body;
    console.log('postReqResults' , garden)
    axios.post('https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app/gardens',
        garden
    )
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.error(error)
        })

});
server_side.get('/getAllUsers', (req, res) => {
    console.log("Connected!");
    axios.get('https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app/users')
        .then((response) => {
            res.send(response.data)
        })
        .catch((error) => {
            console.error(error)
        })

});
server_side.get('/getAllGardens', (req, res) => {
    console.log("Connected!");
    axios.get('https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app/gardens')
        .then((response) => {
            res.send(response.data)
        })
        .catch((error) => {
        })

});

server_side.listen(process.env.PORT || 3000, () => console.log(`Bimkome server on port ${port}!`))

