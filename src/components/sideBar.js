import React, { Component } from 'react';
import { Menu, Button } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../services/firebase';
import { RocketOutlined, BankOutlined, GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default class SideBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: '/world',
        }
    }

    componentDidMount(){
        auth().onAuthStateChanged( (user) => {
            if (user === null){
                this.setState({selected: '/world'});
            }
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.state !== nextState || this.props !== nextProps;
    }

    changePage = (event) => {
        //TODO: change to off the site address?
        if (event){
            if (event.key !== 'null'){
                this.setState({selected: event.key});
                console.log(event)
            }
        }
    }

    render() {
        return (
            <Menu
                theme='dark'
                multiple={false}
                style={{zIndex:-1}}
                selectedKeys={[this.state.selected]}
                onClick={this.changePage}
                mode='inline'
            >
                <Menu.Item/>
                <Menu.Item onClick={this.props.collapse} key={'null'}>
                    {React.createElement(this.props.isCollapsed ? MenuFoldOutlined : MenuUnfoldOutlined)}
                </Menu.Item>
                <Menu.Item
                    icon={<GlobalOutlined/>}
                    key='/world'>
                    <NavLink to={'/world'}>
                        World
                    </NavLink>
                </Menu.Item>
                <Menu.Item
                    icon={<RocketOutlined />}
                    key='/welcome'>
                    <NavLink to={'/welcome'}>
                        Welcome
                    </NavLink>
                </Menu.Item>
                <Menu.Item
                    icon={<BankOutlined />}
                    key='/portfolio'
                    disabled={!this.props.authenticated}>
                    <NavLink to={'/portfolio'}>
                        Portfolio
                    </NavLink>
                </Menu.Item>


            </Menu>

        );
    }
}