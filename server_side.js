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
    axios.post('https://europe-west1-bimkome-1553633910964.cloudfunctions.net/app/users', {
        user
    })
        .then((response) => {
            console.log('whatsapp:+972' + req.query.mobileNumber);
            client.messages.create({
                body: 'שלום ' + req.query.firstName + ' ' +
                    ' תודה רבה שהצטרפת ל"במקומי". \n' +
                    ' רשת להחלפות בטוחות לעובדי הוראה.' +
                    'שם המשתמש שלך הוא .' + req.query.email + ' ' +
                    'והסיסמא הינה: 123456Aa.' +
                    'להורדת האפליקציה אנא כנס לקישור הבא: https://play.google.com/store/apps/details?id=com.bimkomy.bimkomy' +
                    'כדי להתחיל שימוש באפליקציה יש צורך באישור התקנון בקישור הבא: https://bimkomeadmin.firebaseapp.com/#/taknon' +
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

