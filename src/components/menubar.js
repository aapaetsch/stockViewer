import React, { Component } from 'react';
import { Row, Col, Space, Avatar, Button, message} from 'antd';
import { logout } from '../helpers/auth';
import Authenticate from "../popups/authenticate";
import { UserOutlined, ImportOutlined } from '@ant-design/icons';
import '../styles/stocklist.css';
import 'antd/dist/antd.css';
import {auth} from "../services/firebase";

export default class MenuBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: null,
            currentUser: auth().currentUser,
            separatorCol: 15,
            userCol: 2,
        }
    }

    componentDidMount(){
        this.formatMenu();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentUser !== nextProps.currentUser;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.formatMenu();
    }


    formatMenu = () => {
        console.log(this.props.currentUser);
        const currentUsr = this.props.currentUser;
        if (currentUsr === null){
            this.setState({
                separatorCol: 15,
                userCol: 2,
                currentUser: currentUsr,
            });
        } else {
            this.setState({
                separatorCol: 14,
                userCol: 3,
                currentUser: currentUsr,
            });
        }
    }

    render () {
        return(
          <Row justify='end' align='middle' gutter={[5,5]}>
              <Col span={2}/>
              <Col span={2}>
                  <h2>
                      Stonks
                  </h2>
              </Col>
              <Col span={this.state.separatorCol}/>
              <Col className='gutter-row' span={this.state.userCol}>
                  { this.state.currentUser === null ?
                      (<Space>
                          <Authenticate title={'Login'}/>
                          <Authenticate title={'Sign Up'}/>
                      </Space>)
                      :
                      (
                          <Space>
                            <Avatar
                                src={this.state.currentUser.photoURL}
                                icon={<UserOutlined/>}/>
                                { this.state.currentUser.displayName === null ?
                                    (this.state.currentUser.email):(this.state.currentUser.displayName)
                                }&nbsp;&nbsp;
                                <Button type='primary' icon={<ImportOutlined/>} onClick={logout}>
                                    Logout
                                </Button>
                            </Space>
                      )
                  }
              </Col>
              <Col span={3}/>
          </Row>
        );
    }
}