import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router'

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

const AppLayout = ({ children }) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [searchInput, onChangeSearchInput] = useInput('')
    const { me } = useSelector((state) => state.user);

    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`)
    }, [searchInput])

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key={1}>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item key={2}>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item key={3}>
                    <SearchInput
                        enterButton
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                    />
                </Menu.Item>
                <Menu.Item key={4}>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}    
                </Col>
                <Col xs={24} md={6}>
                    <a href="https://oogab.github.io/" target="_blank" rel="noreferrer noopener">Made by WOOK</a>
                </Col>
            </Row>
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default AppLayout