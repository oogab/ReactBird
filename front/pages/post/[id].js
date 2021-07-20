// post/[id].js
import { END } from '@redux-saga/core'
import axios from 'axios'
import Head from 'next/head'
import React from 'react'
import { useSelector } from 'react-redux'
import AppLayout from '../../components/AppLayout'
import PostCard from '../../components/PostCard'
import { LOAD_POST_REQUEST } from '../../reducers/post'
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user'
import wrapper from '../../store/configureStore'
const { useRouter } = require("next/router")

const Post = () => {
    const router = useRouter()
    const { id } = router.query
    const { singlePost } = useSelector((state) => state.post)

    return (
        <AppLayout>
            <Head>
                <title>
                    {singlePost.User.nickname}
                    님의 글
                </title>
                <meta name="description" content={singlePost.content} />
                <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
                <meta property="og:description" content={singlePost.content} />
                <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
                <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
            </Head>
            <PostCard post={singlePost} />
        </AppLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    // console.log(context)
    // 아래처럼 작성하면 서버는 하나이기 때문에... 쿠키가 공유되는 문제가 발생한다!
    // 쿠키를 넣었다가 지웠다가 해줘야 함!
    const cookie = context.req ? context.req.headers.cookie : ''
    axios.defaults.headers.Cookie = ''
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie
    }
    // Home 보다 먼저 실행! Redux에 데이터가 채워진 상태로!
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    })
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.params.id,
    })
    context.store.dispatch(END)
    await context.store.sagaTask.toPromise()
})

export default Post