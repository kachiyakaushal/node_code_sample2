var events = require('events');
var notificationEmitter = new events.EventEmitter();
var _ = require('underscore');

require('dotenv').config();
var PushNotifications = require('node-pushnotifications');
const push = new PushNotifications(CONFIG.NOTIFICATION_SETTINGS);

const User = require("../models").User;
const UserDeviceToken = require("../models").UserDeviceToken;
const Notification = require("../models").Notification;

// Bind the connection event with the function
notificationEmitter.on('sendNotification',async function(data){
    var newNotification = data;

    UserDeviceToken.findAll({
        where: {userId : newNotification.toUserId},
        raw :true
    }).then(async tokens => {

        const notificationData = {
            title: data.title, // REQUIRED for Android
            topic: 'com.test.sample', // REQUIRED for iOS (apn and gcm)
            body: data.body,
            custom: {
                sender: 'Test',
                chatRoomData: null,
                type: 1
            },
            sound: 'default',
            priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
            alert: { // apn, will take precedence over title and body
                title: data.title,
                body: data.body
                // details: https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown#convenience-setters
            },
            expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // unit is seconds. if both expiry and timeToLive are given, expiry will take precedence
            timeToLive: 28 * 86400,
            consolidationKey: 'my notification', // ADM
        };
         
        let deviceTokens = await _.pluck(tokens,'deviceToken')
        // Or you could use it as a promise:
        push.send(deviceTokens, notificationData)
            .then((results) => { 
                if(results[0].success == 1){
                    newNotification.status = 1
                } else {
                    newNotification.status = 0
                }
                return Notification.create(newNotification).catch(err => {
                    console.log(err)
                });
             })
            .catch((err) => { 
                console.log(err)
             });

        //create database entry
    }).catch(err=>{
        console.log(err)
    })
    
});

module.exports.notificationEmitter = notificationEmitter