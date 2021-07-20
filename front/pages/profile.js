import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import AppLayout from '../components/AppLayout'
import NicknameEditForm from '../components/NicknameEditForm'
import FollowList from '../components/FollowList'
import { useSelector } from 'react-redux'
import Router from 'next/router'
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import { END } from 'redux-saga'
import wrapper from '../store/configureStore'
import axios from 'axios'
import useSWR from 'swr'
import { backUrl } from '../config/config'

const fetcher = (url) => axios.get(url, {withCredentials: true}).then((result) => result.data)

const Profile = () => {
    // const dispatch = useDispatch()
    const { me } = useSelector((state) => state.user)
    const [followersLimit, setFollowersLimit] = useState(3)
    const [followingsLimit, setFollowingsLimit] = useState(3)

    const { data: followersData , error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher)
    const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher)

    // useEffect(() => {
    //     dispatch({
    //         type: LOAD_FOLLOWERS_REQUEST,
    //     })
    //     dispatch({
    //         type: LOAD_FOLLOWINGS_REQUEST,
    //     })
    // }, [])
    
    useEffect(() => {
        if(!(me && me.id)) {
            Router.push('/')
        }
    }, [me && me.id])

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3)
    }, [])

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3)
    }, [])
    
    if(!me) {
        return '내 정보 로딩중...'
    }

    // return은 반드시 훅 이후에 등장해야 한다!
    if (followerError || followingError) {
        console.error(followerError || followingError)
        return '팔로잉/팔로워 로딩 중 에러가 발생합니다.'
    }

    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
                <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
            </AppLayout>
        </>
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
    context.store.dispatch(END)
    await context.store.sagaTask.toPromise()
})

export default Profile