// express모듈 셋팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { checkout } = require('./users')
const { body, validationResult } = require('express-validator')

router.use(express.json())

const validate=(req,res,next)=>{
    const err = validationResult(req)
    if ((!err.isEmpty)) {
        return res.status(400).json(err.array)
    } else {
        return next(); // 다음 할 일 ( 미들 웨어, 함수 )
    }
}


router.
    route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력해주세요!'),
            validate
        ],
        (req, res) => {
            const err = validationResult(req)
            if ((!err.isEmpty)) {
                return res.status(400).json(err.array)
            }
            var { userId } = req.body
            let sql = `SELECT * FROM channels Where user_id = ?`


            conn.query(sql, userId,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end();
                    }

                    if (result.length) {
                        res.status(200).json(result)
                    }
                    else {
                        notFoundChannel(res)
                    }
                }
            );


        })// 채널 전체 조회
    .post(
        [body('userId').notEmpty().isInt().withMessage('숫자 입력해주세요!'),
        body('name').notEmpty().isString().withMessage('문자 입력해주세요'),],
        (req, res) => {
            const err = validationResult(req)
            if ((!err.isEmpty)) {
                return res.status(400).json(err.array)
            }
            const { name, userId } = req.body

            let sql = `INSERT INTO channels  (name, user_id) VALUES(?,?)`
            conn.query(sql, [name, userId],
                function (err, result, fields) {
                    if (err)
                        return res.status(400).end();
                }
            );


        })// 채널 개별 생성


router
    .route('/:id')
    .get(
        param('id').notEmpty().withMessage('채널 id 필요'),
        (req, res) => {

            const err = validationResult(req)
            if ((!err.isEmpty)) {
                return res.status(400).json(err.array)
            }
            let { id } = req.params
            id = parseInt(id)
            let sql = `SELECT * FROM channels Where id = ?`
            conn.query(sql, id,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end();
                    }
                    if (result.length) {
                        res.status(200).json(result)
                    }
                    else {
                        notFoundChannel(res)
                    }
                }
            );
        })//채널 개별 조회
    .put(
        [param('id').notEmpty().withMessage('채널 id 필요'),
        body('name').notEmpty().isString().withMessage('채널명 오류')
        ],
        (req, res) => {
            const err = validationResult(req)
            if ((!err.isEmpty)) {
                return res.status(400).json(err.array)
            }
            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            let sql = `UPDATE channels SET name = ? WHERE id = ?`
            let values = { name, userId }
            conn.query(sql, values,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end();
                    }
                    if (result.affectedRows == 0) {
                        return res.status(200).json(result)
                    } else {
                        res.status(200).json(result)
                    }

                }
            )

        })//채널 개별 수정
    .delete(
        param('id').notEmpty().withMessage('채널 id 필요'),
        (req, res) => {
            const err = validationResult(req)
            if ((!err.isEmpty)) {
                return res.status(400).json(err.array)
            }
            let { id } = req.params
            id = parseInt(id)

            conn.query(
                `DELETE FROM channels WHERE id = ?`, id,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end();
                    }
                    if (result.affectedRows == 0) {
                        return res.status(200).json(result)
                    } else {
                        res.status(200).json(result)
                    }

                }
            );


        })//채널 개별 삭제

function notFoundChannel(res) {
    res.status(404).json({
        msg: "채널 정보를 찾을 수 없습니다"
    })
}
module.exports = router
