const express = require('express')
const { Op } = require('sequelize')
const { Hashtag, User, Image, Comment, Post } = require('../models')
const router = express.Router()

router.get('/:tag', async (req, res, next) => { // GET /hashtag/노드
    try {
        const where = {}
        if (parseInt(req.query.lastId, 10)) {   // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        const posts = await Post.findAll({
            // where: { id: lastId }, // lastId는 고정이기에 중간에 게시글 추가, 삭제에 영향을 받지 않음!
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            include: [{
                model: Hashtag,
                where: { name: decodeURIComponent(req.params.tag) },
            }, { // 게시글 작성자
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{ // 댓글 작성자
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id']
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        })
        // console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router