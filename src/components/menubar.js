import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Row, Col, Space, Avatar, Button, Input, Modal, message} from 'antd';
import { logout } from '../helpers/auth';
import Authenticate from "../popups/authenticate";
import { UserOutlined, ImportOutlined } from '@ant-design/icons';
import '../App.css';
import {checkTickerExists} from "../helpers/APICommunication";
import StockDataDisplay from "../popups/StockDisplay";


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
            showStockPopup: false,
            stockDisplayData: {}
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

    openStockPopup = (data) => {
        this.setState({stockDisplayData: data, showStockPopup: true});
    }

    closeStockPopup = () => {
        this.setState({stockDisplayData: {}, showStockPopup: false});
    }

    render () {
        function registeredUser(user) {
            return (
                <Space size='small'>
                    <Avatar
                        src={user.photoURL}
                        icon={<UserOutlined/>}
                        />
                        <span style={{color: 'white', fontSize: '11px'}}>
                            { user.displayName === null
                                ? (user.email)
                                : (user.displayName)
                            } &nbsp;
                        </span>
                    <Button type='primary' icon={<ImportOutlined/>} onClick={logout}>
                        <NavLink to='/stockViewer/world' style={{color: 'white'}}>
                            Logout
                        </NavLink>
                    </Button>
                </Space>
            );
        }
        const logoCol = {
            'xs': 8,
            'sm': 4,
            'md': 4,
            'lg': 4
        }
        const searchCol = {
            'xs': 0,
            'sm': 7,
            'md': 9,
            'lg': 12
        }
        const loginCol = {
            'xs':15,
            'sm':12,
            'md':10,
            'lg':7
        }

        return(
            <div>
                <Row align='center' justify='space-between' gutter={this.state.menuBarGutter}>
                    <Col {...logoCol}>
                        {/*Add logo??*/}
                        <h2 style={{color:'white'}}>
                            Stonks
                        </h2>
                    </Col>
                    <Col {...searchCol}>
                        <Search
                            placeholder="Enter a Ticker"
                            style={{width: '100%', paddingTop: '16px'}}
                            onSearch={ async (value) => {
                                message.loading({content: 'Searching for ticker...', key: 'searchMessage'},0)
                                const data = await checkTickerExists(value.toUpperCase())
                                if (data !== null && data !== false){
                                    message.success({content: `${value.toUpperCase()} found!`, key: 'searchMessage'}, 1)
                                    this.openStockPopup(data);

                                    // Modal.info({
                                    //     content: <StockDataDisplay data={data} owned={false}/>,
                                    //     title:
                                    //         <h2 style={{ alignSelf: 'center'}}>
                                    //             {`${data.title}`}
                                    //         </h2>,
                                    //     width: '60%',
                                    //     icon: null,
                                    //     className: 'loginCard'
                                    // })
                                } else {
                                    message.error({content: `Could not find ${value} `, key: 'searchMessage'}, 1);
                                }
                            }}
                            enterButton/>
                    </Col>
                    <Col {...loginCol} style={{textAlign: 'right'}}>
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
                </Row>
                <Authenticate
                    visible={this.state.showAuthenticate}
                    title={this.state.authenticateType}
                    closeAuthenticate={this.hideAuthenticate}
                    changeAuthenticateType={this.switchAuthenticateType}
                />
                {/*TODO: add */}
                <StockDataDisplay
                    close={this.closeStockPopup}
                    owned={false}
                    data={this.state.stockDisplayData}
                    visible={this.state.showStockPopup}
                />
            </div>

        );
    }
}