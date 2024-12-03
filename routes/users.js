// express모듈 셋팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')


router.use(express.json()) // http 외 모듈 'json'

//로그인
router.post('/login', (req, res) => {
    console.log(req.body)

    const { userId, password } = req.body
    var loginUser = {}

    conn.query(
        `SELECT * FROM users Where email = ?`, email,
        function (err, result, fields) {
            var loginUser = result[0];

            if (loginUser && loginUser.password == password) {
                res.status(200).json({
                    msg: `${loginUser.name}님이 로그인 되었습니다`
                })
            }
            else {
                res.status(404).json({
                    msg: `이메일 또는 비밀번호가 틀렸습니다`
                })
            }
        }
    );
})

//회원가입
router.post('/join', (req, res) => {

    if (req.body == {}) {
        res.status(400).json({
            msg: `입력  값을 다시 확인해주세요`
        })

    } else {
        const { email, name, password, contact } = req.body
        conn.query(
            `INSERT INTO users  (email, name, password, contact) VALUES(?,?,?,?)`, [email, name, password, contact],
            function (err, result, fields) {
                res.status(201).json(result)
            }
        );
    }
})

router
    .route('/users/:id')
    //회원 개별 조회
    .get((req, res) => {
        let { email } = req.body
        conn.query(
            `SELECT * FROM users Where email = ?`, email,
            function (err, result, fields) {
                res.status(200).json(result)
            }
        );
    })
    //회원 개별 탈퇴
    .delete((req, res) => {
        let { email } = req.body
        conn.query(
            `DELETE FROM users Where email = ?`, email,
            function (err, result, fields) {
                res.status(200).json(result)
            }
        );

    })

module.exports = router