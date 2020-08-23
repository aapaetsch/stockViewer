import React, { Component } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { auth } from '../services/firebase';
import { BankOutlined, GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css';
import '../App.css';

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
                    <NavLink to={'/stockViewer/'}>
                        World
                    </NavLink>
                </Menu.Item>
                {/*<Menu.Item*/}
                {/*    icon={<RocketOutlined />}*/}
                {/*    key='/welcome'>*/}
                {/*    <NavLink to={'/welcome'}>*/}
                {/*        Welcome*/}
                {/*    </NavLink>*/}
                {/*</Menu.Item>*/}
                <Menu.Item
                    icon={<BankOutlined />}
                    key='/portfolio'
                    disabled={!this.props.authenticated}>
                    <NavLink to={'/stockViewer/portfolio'}>
                        Portfolio
                    </NavLink>
                </Menu.Item>


            </Menu>

        );
    }
}