// express모듈 셋팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { checkout } = require('./users')

router.use(express.json())

let db = new Map()
var id = 1 // 하나의 객체를 유티크하게 구별하기 위함


router.
    route('/')
    .get((req, res) => {
        var { userId } = req.body
        let sql = `SELECT * FROM channels Where user_id = ?`
        var channels = []
        if (userId) {
            conn.query(sql, userId,
                function (err, result) {
                    if (result.length) {
                        channel = result
                    }
                    else {
                        notFoundChannel(res)
                    }
                }
            );
        } else {
            res.status(400).end()
        }
    })// 채널 전체 조회
    .post((req, res) => {
        const { name, userId } = req.body
        if (name && userId) {
            let sql = `INSERT INTO channels  (name, user_id) VALUES(?,?)`
            conn.query(sql, [name, userId],
                function (err, result, fields) {
                    res.status(201).json(result)
                }
            );
        } else {
            res.status(400).json({
                msg: "요청 값을 제대로 보내주세요"
            })
        }
    })// 채널 개별 생성


router
    .route('/:id')
    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        let sql = `SELECT * FROM channels Where id = ?`
        conn.query(sql, id,
            function (err, result) {
                if (result.length) {
                    res.status(200).json(result)
                }
                else {
                    notFoundChannel(res)
                }
            }
        );
    })//채널 개별 조회
    .put((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        var channel = db.get(id)
        var oldTitle = channel.title

        if (channel) {
            var newTitle = req.body.title
            channel.title = newTitle
            db.set(id, channel)
            res.json({
                msg: `채널명이 정상적으로 수정되었습니다. 기존${oldTitle} -> 수정${newTitle}`
            })
        } else {
            notFoundChannel(res)
        }
    })//채널 개별 수정
    .delete((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        var channel = db.get(id)
        if (channel) {
            db.delete(id)
            res.status(200).json({
                msg: `${channel.title}이 정상적으로 삭제되었습니다`
            })
        } else {
            notFoundChannel(res)
        }
    })//채널 개별 삭제

function notFoundChannel(res) {
    res.status(404).json({
        msg: "채널 정보를 찾을 수 없습니다"
    })
}
module.exports = router
