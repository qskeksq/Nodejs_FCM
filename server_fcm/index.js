const fun = require('firebase-function');
const admin = require('firebase-admin');
admin.initializeApp(fun.config().firebase);

exports.addMessage = fun.https.onRequest((req, res)=>{
    // http 요청에서 ? 다음에 있는 변수 중에 text 변수 값을 가져온다
    var msg = req.query.text;
    // 파이어베이스 db의 message 레퍼런스에 그 값을 넣는다
    admin.database.ref('/message')
        .push({msg:msg})
        .then(snapshot=>{
            res.redirect(30, snapshot.ref)
        });
});