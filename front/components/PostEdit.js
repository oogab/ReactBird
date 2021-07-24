import React, { useCallback, useRef, useEffect } from "react"
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'
import { useDispatch, useSelector } from "react-redux"
import { addPost, ADD_POST_REQUEST, MODIFY_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from "../reducers/post"
import useInput from "../hooks/useInput"

const PostEdit = ({ post, onCancel }) => {
    const { imagePaths, addPostDone } = useSelector((state) => state.post)
    const dispatch = useDispatch()
    const imageInput = useRef()
    const [text, onChangeText, setText] = useInput('')

    // useEffect(() => {
    //     if (addPostDone) {
    //         setText('')
    //     }
    // }, [addPostDone])

    const onSubmit = useCallback(() => {
        // dispatch 자리에는 객체가 들어와야 한다!
        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요.')
        }
        const formData = new FormData()
        formData.append('content', text)
        formData.append('postid', post.id)
        dispatch({
            type: MODIFY_POST_REQUEST,
            data: formData
        })
        onCancel()
    }, [text])

    return (
        <Form style={{margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder={post.content}
            />
            <div>
                <Button onClick={onCancel}>취소</Button>
                <Button type="primary" style={{ float:'right' }} htmlType="submit">수정완료</Button>
            </div>
        </Form>
    )
}

PostEdit.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.any),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default PostEdit