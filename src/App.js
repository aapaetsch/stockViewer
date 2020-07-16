import React, { Component } from 'react';
import { auth } from './services/firebase';
import {Col, Row} from "antd";
import MenuBar from "./components/menubar";
import MainPage from "./pages/mainpage";



export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: null,
        };
    }

    componentDidMount(){
        auth().onAuthStateChanged((user) => {
            this.setState({currentUser: user});
        });
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentUser !== auth().currentUser;
    }
    componentDidUpdate(){
        this.setState({currentUser: auth().currentUser});
    }


    render() {
        return (
            <div>
                <Row justify='end' gutter={[0, 20]} align='middle'>
                    {/*Login bar and ect...*/}
                    <Col span={24} style={{background: 'white'}}>
                        <br/>
                        <MenuBar currentUser={this.state.currentUser}/>
                    </Col>
                </Row>
                <MainPage currentUser={this.state.currentUser}/>
            </div>
        )

    }

}

