import React, { Component } from 'react';
import { auth } from './services/firebase';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import {Col, Row, Layout, Menu, Button, Affix} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import MenuBar from "./components/menubar";
import SideBar from "./components/sideBar";
import MainPage from "./pages/mainpage";
import WelcomePage from './pages/welcomePage';
import WorldStats from './pages/worldStats';
import Portfolio from "./pages/Portfolio";
import './App.css';

const {Header, Content, Footer, Sider} = Layout;

function PrivateRoute({ component: Component, authenticated, ...rest}){
    return (
        <Route
            {...rest}
            render={(props) => authenticated === true
                ? <Component />
                : <Redirect to={{pathname: '/', state: {from: props.location}}}/>
            }
            />
    );
}
function PublicRoute({ component: Component, authenticated, ...rest}){
    return (
        <Route {...rest}
            render={ (props) => authenticated === false
                ? <Component {...props}/>
                : <Redirect to={'/'}/>
            }
                />
    )
}

export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: null,
            authenticated: false,
            collapsed: true
        };
        this.separatorCol = 15;
        this.userCol = 2;
    }

    componentDidMount(){
        auth().onAuthStateChanged((user) => {
            this.setState({currentUser: user}, () => {
                if (this.state.currentUser){
                    this.setState({authenticated: true});
                } else {
                    this.setState({authenticated: false});
                }
            });
        });
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentUser !== auth().currentUser ||
            this.state.authenticated !== nextState.authenticated ||
            this.state.collapsed !== nextState.collapsed;
    }

    componentDidUpdate(){
        if (auth().currentUser === null){
            this.setState({authenticated: false});
        } else {
            this.setState({authenticated: true});
        }
        this.setState({currentUser: auth().currentUser});
    }

    collapseSidebar = () => {
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {
        return (
            <div>
                <Router>
                    <Layout>
                        <Header style={{position: 'fixed', zIndex: 10, width: '100%'}}>
                            <MenuBar currentUser={this.state.currentUser}/>
                        </Header>

                        <Layout>
                            <Sider
                                breakpoint='lg'
                                collapsible
                                style={{height: '200vh', zIndex:0}}
                                collapsed={this.state.collapsed}
                                trigger={null}
                                >
                                <br/>
                                <Affix offsetTop={25}>
                                    <SideBar
                                        authenticated={this.state.authenticated}
                                        isCollapsed={this.state.collapsed}
                                        collapse={this.collapseSidebar}
                                    />
                                </Affix>
                            </Sider>

                            <Content>
                                {/*Here is the router for the content*/}
                                    <Switch>
                                        <Route exact path={'/'} component={WorldStats}/>
                                        <PrivateRoute
                                            path='/portfolio'
                                            authenticated={this.state.authenticated}
                                            component={Portfolio}
                                        />
                                        {/*<PublicRoute path='/world' component={World}/>*/}
                                    </Switch>
                            </Content>
                        </Layout>
                    </Layout>
                </Router>
            </div>
        )
    }
}

