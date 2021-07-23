const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const hpp = require('hpp')
const helmet = require('helmet')

const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const userRouter = require('./routes/user')
const hashtagRouter = require('./routes/hashtag')

const db = require('./models')
const passportConfig = require('./passport')

dotenv.config()
const app = express()
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공')
    })
    .catch(console.err)
passportConfig()

// REST API
// app.get -> 가져오다
// app.post -> 생성하다
// app.put -> 전체수정
// app.delete -> 제거
// app.patch -> 부분수정
// app.options -> 찔러보기
// app.head -> 헤더만 가져오기 (헤더/바디)
// 애매하면 post쓰면 된다ㅋㅋ
// REST API를 완벽히 지키는 일은 드물다!

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
    app.use(morgan('combined'))
    app.use(hpp())
    app.use(helmet())
    app.use(cors({
        origin: ['https://myme.today'],
        credentials: true,
    }))
} else {
    app.use(morgan('dev'))
    app.use(cors({
        origin: true,
        credentials: true,
    }))
}

app.use('/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json()) // front에서 json형식으로 보낸 데이터를 해석
app.use(express.urlencoded({ extended: true })) // front에서 form형식으로 보낸 데이터를 해석
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: true,
        domain: process.env.NODE_ENV === 'production' && '.myme.today'
    },
}))
app.use(passport.initialize())
app.use(passport.session())

// 라우터가 계속 많아져! -> 분리하자!!
app.get('/', (req, res) => {
    res.send('Hello express')
})

app.get('/api', (req, res) => {
    res.send('Hello api')
})

// app.get('/posts', (req, res) => {
//     res.json([{
//             id: 1,
//             content: 'hello'
//         },
//         {
//             id: 2,
//             content: 'hello2'
//         },
//         {
//             id: 3,
//             content: 'hello3'
//         },
//     ])
// })

app.use('/posts', postsRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)

// 에러처리 미들웨어 내부적으로 이 위치에 존재!
// app.use((err, req, res, next) => {
//    
// })

app.listen(3065, () => {
    console.log('서버 실행 중!!')
})