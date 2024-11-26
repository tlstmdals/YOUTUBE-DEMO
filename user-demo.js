// express모듈 셋팅
const express = require('express')
const app = express()
app.listen(8888) 

let db = new Map()
var id = 1 // 하나의 객체를 유티크하게 구별하기 위함

//로그인
app.post('/login',(req,res)=>{
console.log(req.body)

    const {userId, password} = req.body
    var loginUser = {}
    db.forEach(function(user, id){
        if(user.userId===userId){
            loginUser = user
        }
    })
    // userid 값을 못찾았으면
    if(isExist(loginUser)){
        console.log("같은 거 찾았다")
        hasUserId = true
        if (loginUser.password === password){
            console.log("패스워드도 같다")
        } else{
            console.log("패스워드 틀렸다")
        }
    }else{
        console.log("없는 아이디 입니다")
    }
})

function isExist(obj){
    if(Object.keys(obj).length){
        return false
    }else{
        return true
    }
}
//회원가입
app.post('/join',(req,res)=>{
    
    if(req.body == {}){
        res.status(400).json({
            msg : `입력  값을 다시 확인해주세요`
        })

    }else{
        db.set(id++,req.body)
        res.status(201).json({
            msg : `${db.get(id-1)}님 환영합니다}`
        })
    }
})

app
    .route('/users/:id')
    //회원 개별 조회
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                msg : "회원 정보가 없습니다"
            })
        }else{
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }
    })
    //회원 개별 탈퇴
    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                msg : "회원 정보가 없습니다"
            })
        }else{
            db.delete(id)
            res.status(200).json({
                msg : `${user.name}님 다음에 또 뵙겠습니다`
            })
        }
    })
