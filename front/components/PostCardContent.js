import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Button, Input } from 'antd'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { UPDATE_POST_REQUEST } from '../reducers/post'

const { TextArea } = Input
const PostCardContent = ({ postData, editMode, onChangePost, onCancelUpdate }) => { // 첫 번째 게시글 #해시태그 #익스프레스
    const { updatePostLoading, updatePostDone } = useSelector((state) => state.post)
    const [editText, setEditText] = useState(postData)

    useEffect(() => {
        if (updatePostDone) {
            onCancelUpdate()
        }
    }, [updatePostDone])

    const onChangeText = useCallback((e) => {
        setEditText(e.target.value)
    }, [])

    return (
        <div>
            {editMode
                ? (
                    <>
                        <TextArea value={postData} onChange={onChangeText}/>
                        <Button.Group>
                            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
                            <Button onClick={onCancelUpdate}>취소</Button>
                        </Button.Group>
                    </>
                )
                : postData.split(/(#[^\s#]+)/g).map((v, i) => {
                    if(v.match(/(#[^\s#]+)/)) {
                        return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}><a>{v}</a></Link>
                    }
                    return v
                })
            }
        </div>
    )
}

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    onCancelUpdate: PropTypes.func.isRequired
}

PostCardContent.defaultProps = {
    editMode: false,
}

export default PostCardContent