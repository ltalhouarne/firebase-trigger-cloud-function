'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'legcount@gmail.com',
        pass: 'OMITTED'
    }
});

exports.sendStatusChangeEmail = functions.database.ref('/players/{uid}')
        .onWrite(event => {
            const snapshot = event.data;
            const val = snapshot.val();

            if((val.present == 'Yes' || val.present == 'No') && snapshot.child('present').changed()) {
                transporter.sendMail({
                    from: 'legcount@gmail.com',
                    to: 'talhouar.loic@gmail.com',
                    subject: val.name + ( val.present == 'Yes' ? " will be there." : " won't be there."),
                    text: val.log
                }, function (error, info) {
                    console.log(error ? error : 'Email sent: ' + info.response);
                });
            }
});
