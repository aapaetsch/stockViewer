import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Space, Avatar, Button, Input} from 'antd';
import { logout } from '../helpers/auth';
import Authenticate from "../popups/authenticate";
import { UserOutlined, ImportOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../App.css';

const { Search } = Input;

export default class MenuBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            separatorCol: 15,
            userCol: 2,
            menuBarGutter: 8,
            showAuthenticate: false,
            authenticateType: null,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.currentUser !== nextProps.currentUser || this.state !== nextState;
    }

    showAuthenticate = (type) => {
        this.setState({showAuthenticate: true, authenticateType:type});
        console.log('click');
    }
    hideAuthenticate = () => {
        this.setState({showAuthenticate: false, authenticateType: null});
    }

    switchAuthenticateType = () => {
        if (this.state.authenticateType === 'Login'){
            this.setState({authenticateType: 'Sign Up'});
        } else {
            this.setState({authenticateType: 'Login'});
        }
    }


    render () {
        function registeredUser(user) {
            return (
                <Space size='large'>
                    <Avatar
                        src={user.photoURL}
                        icon={<UserOutlined/>}
                        />
                        <span style={{color: 'white'}}>
                            { user.displayName === null
                                ? (user.email)
                                : (user.displayName)
                            } &nbsp; &nbsp;
                        </span>
                    <Button type='primary' icon={<ImportOutlined/>} onClick={logout}>
                        <NavLink to='/welcome' style={{color: 'white'}}>
                            Logout
                        </NavLink>
                    </Button>
                </Space>
            );
        }


        return(
            <Row align='center' justify='space-between' gutter={this.state.menuBarGutter}>
                <Col flex={3}>
                    {/*Add logo??*/}
                    <h2 style={{color:'white'}}>
                        Stonks
                    </h2>
                </Col>
                <Col flex={6} offset={1}>
                    <Search
                        placeholder="Enter a Ticker"
                        style={{width: '100%', paddingTop: '4%'}}
                        onSearch={ (value) => console.log('search bar:',value)}
                        enterButton/>
                </Col>
                <Col flex={6} offset={4}>
                {/*Login/ authenticated user*/}
                    { this.props.currentUser === null
                        ? (
                            <Space>
                                <Button type='primary' onClick={() => this.showAuthenticate('Login')}>
                                    Login
                                </Button>
                                <Button type='primary' onClick={() => this.showAuthenticate('Sign Up')}>
                                    Sign Up
                                </Button>
                            </Space>
                            )
                        : (registeredUser(this.props.currentUser))
                    }
                </Col>
                <Authenticate
                    visible={this.state.showAuthenticate}
                    title={this.state.authenticateType}
                    closeAuthenticate={this.hideAuthenticate}
                    changeAuthenticateType={this.switchAuthenticateType}
                />
            </Row>
        );
    }
}