const express = require('express')
const { Op } = require('sequelize')
const { Post, User, Image, Comment } = require('../models')

const router = express.Router()

router.get('/', async (req, res, next) => { // GET /posts
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
            include: [{ // 게시글 작성자
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
            // limit, offset -> DB에서 제공하는 기능 이용! 생각보다 비효율적이다!
            // limit: 10,
            // offset: 100, // 101~110
            // order: [['createdAt', 'DESC']]
            // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            // 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
            // 20부터 가져오는 와중에 누가 21번째를 작성하면 21번째를 못가져온다! 그리고 11번째부터 가져오게 된다!
            // 중간에 게시글의 추가, 삭제 시 문제 발생!
        })
        // console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

// 내가 팔로잉한 사람들
router.get('/related', async (req, res, next) => { // GET /posts
    try {
        const followings = await User.findAll({
            attributes: ['id'],
            include: [{
                model: User,
                as: 'Followers',
                where: { id: req.user.id }
            }]
        })
        const where = {
            UserId: { [Op.in]: followings.map((v) => v.id) }
        }
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
            include: [{ // 게시글 작성자
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
            // limit, offset -> DB에서 제공하는 기능 이용! 생각보다 비효율적이다!
            // limit: 10,
            // offset: 100, // 101~110
            // order: [['createdAt', 'DESC']]
            // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            // 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
            // 20부터 가져오는 와중에 누가 21번째를 작성하면 21번째를 못가져온다! 그리고 11번째부터 가져오게 된다!
            // 중간에 게시글의 추가, 삭제 시 문제 발생!
        })
        // console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

// 내가 보고 싶지 않은 사람들...
router.get('/unrelated', async (req, res, next) => { // GET /posts
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
            include: [{ // 게시글 작성자
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
            // limit, offset -> DB에서 제공하는 기능 이용! 생각보다 비효율적이다!
            // limit: 10,
            // offset: 100, // 101~110
            // order: [['createdAt', 'DESC']]
            // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
            // 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
            // 20부터 가져오는 와중에 누가 21번째를 작성하면 21번째를 못가져온다! 그리고 11번째부터 가져오게 된다!
            // 중간에 게시글의 추가, 삭제 시 문제 발생!
        })
        // console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router