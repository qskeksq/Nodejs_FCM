const fun = require('firebase-functions');
const admin = require('firebase-admin');
// const httpUrlConnection = require('request');
admin.initializeApp(fun.config().firebase);

// 내 개인 서버로 Firebase functions를 사용하겠다
exports.addMessage = fun.https.onRequest((req, res)=>{
    // http 요청에서 ? 다음에 있는 변수 중에 text 변수 값을 가져온다
    var text = req.query.text;
    // 파이어베이스 db의 message 레퍼런스에 그 값을 넣는다
    admin.database().ref('/message')
        .push({msg:text}) // 받아온 값을 msg로 넣어준다
        .then(snapshot=>{ // 받아온 후
            res.end("success!!!")
        });
});

// fcm 설정 : 구글에서 미리 설정해 둔 서버
const fcmServerUrl = 'https://fcm.googleapis.com/fcm/send'; 
// 서버키
const serverKey = '';


// 파이어베이스 서버에 요청
exports.sendNotification = fun.https.onRequest((req, res)=>{

    // json 데이터로 post 값을 수신
    var dataObj = req.body;
    var msg = {
        notification : {
            title : "노티바에 나타나는 타이틀",
            body : dataObj.msg
        }
    };
    var tokens = [];
    tokens.push(dataObj.to);
    admin.messaging().sendToDevice(tokens, msg)
    .then(function(response){
        res.status(200).send(response);
    })
    .catch(function(error){
        res.status(501).send(error);
    });
});