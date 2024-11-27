// express모듈 셋팅
const express = require('express')
const router = express.Router()

router.use(express.json()) // http 외 모듈 'json'
let db = new Map()
var id = 1 // 하나의 객체를 유티크하게 구별하기 위함

//로그인
router.post('/login',(req,res)=>{
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
        if (loginUser.password === password){
            res.status(200).json({
                msg : `${loginUser.name}님이 로그인 되었습니다`
            })
        } else{
            res.status(400).json({
                msg : `비밀번호가 틀렸습니다`
            })
        }
    }else{
        res.status(404).json({
            msg : `회원 정보가 없습니다`
        })
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
router.post('/join',(req,res)=>{
    
    if(req.body == {}){
        res.status(400).json({
            msg : `입력  값을 다시 확인해주세요`
        })

    }else{
        const {userId} = req.body
        db.set(req.body.userId,req.body)
        res.status(201).json({
            msg : `${db.get(userId).name}님 환영합니다}`
        })
    }
})

router
    .route('/users/:id')
    //회원 개별 조회
    .get((req,res)=>{
        let {userId} = req.body
        const user = db.get(userId)

        if(user){
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }else{
            res.status(404).json({
                msg : "회원 정보가 없습니다"
            })
        }
    }) 
    //회원 개별 탈퇴
    .delete((req,res)=>{
        let {userId} = req.body
        const user = db.get(userId)
        if(user){
            db.delete(id)
            res.status(200).json({
                msg : `${user.name}님 다음에 또 뵙겠습니다`
            })
        }else{
            res.status(404).json({
                msg : "회원 정보가 없습니다"
            })
        }
    })

    module.exports = router