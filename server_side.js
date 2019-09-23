var mysql = require('mysql');
const cors = require('cors')({origin: true});
const express = require('express')
const server_side = express()
const port = process.env.PORT || '8080';
const bodyParser = require('body-parser');

const axios = require('axios')
const accountSid = 'ACad6097f990b6cf31446a6470848663c9';
const authToken = 'e1d1c54265af3d0aa8760dee74c1c161';
const client = require('twilio')(accountSid, authToken);
const bimkomeServer = 'https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app';
let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };
  var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

server_side.use(allowCrossDomain);
server_side.use(bodyParser.urlencoded({extended: false}));
server_side.use(express.json());
server_side.use(express.urlencoded());
server_side.use(bodyParser.json());

server_side.get('/signUpUsers', (req, res) => {
    console.log("Connected!");
    const user = req.query;
    axios.post(bimkomeServer + '/users', {
        user
    })
        .then((response) => {
            client.messages.create({
                body: ' שלום ' + req.query.firstName + '\n ' +
                    'תודה רבה שהצטרפת ל"במקומי ". \n' +
                    ' רשת להחלפות בטוחות לעובדי הוראה.\n' +
                    'כמעט סיימת את ההרשמה, עליך לאשר את התקנון בלינק המצורף.\n' +
                    'לאחר אישורו,\n יישלח אלייך \n' +
                    'שם משתמש וסיסמה\n' +
                    '\n https://bimkomeadmin.firebaseapp.com/#/taknon?email=' + req.query.email + ' ' +
                    'תודה רבה, צוות במקומי.',
                to: '+972' + req.query.mobileNumber,  // Text this number
                from: '+972526453007' // From a valid Twilio number
            })
                .then((message) => {
                    res.send(response.data)
                    console.log(message.sid)
                })
                .catch((error) => console.log(error));
        })
        .catch((error) => {
            console.log(error);

        })

});
server_side.post('/signUpGardens', (req, res) => {
    console.log("Connected!");
    const garden = req.body;
    console.log('postReqResults', garden)
    axios.post(bimkomeServer + '/gardens',
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
    axios.get(bimkomeServer + '/users')
        .then((response) => {
            res.send(response.data)
        })
        .catch((error) => {
            console.error(error)
        })

});
server_side.get('/getAllGardens', (req, res) => {
    console.log("Connected!");
    axios.get(bimkomeServer + '/gardens')
        .then((response) => {
            res.send(response.data)
        })
        .catch((error) => {
        })

});
server_side.get('/getAllCities', (req, res) => {
    console.log("Connected!");
    axios.get(bimkomeServer + '/cities')
        .then((response) => {
            res.send(response.data)
        })
        .catch((error) => {
        })

});
server_side.post('/signUpGardens', (req, res) => {
    console.log("Connected!");
    const data = req.body;
    console.log('postReqResults', garden)
    axios.put(bimkomeServer + '/gardens',
        data
    )
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.error(error)
        })

});
server_side.post('/updateCity', (req, res) => {
    console.log("Connected! update city");
    const data = req.body;      
    console.log( Object.keys(data)[0], JSON.stringify(Object.values(data)[0]));
    axios.put(bimkomeServer + '/cities' + '/' + Object.keys(data)[0], JSON.stringify(Object.values(data)[0]) , axiosConfig)
    .then((res) => {
        console.log(res.status)
    })
    .catch((error) => {
    })

});

server_side.listen(process.env.PORT || 3000, () => console.log(`Bimkome server on port ${port}!`))

