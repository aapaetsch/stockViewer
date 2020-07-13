import React, { Component } from 'react';
import { Row, Col} from 'antd';
import StockList from "../components/stocklist";
import MenuBar from "../components/menubar";
import 'antd/dist/antd.css';
import '../App.css';
import LocationDonut from "../components/locationDonut";
import CatagoryRadar from "../components/catagoryRadar";
import { auth } from '../services/firebase';


export default class MainPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            borders: [16,16],
            currentUser: null,
        }
    }

    componentDidMount(){
        this.setState({
            currentUser: auth().currentUser,
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return auth().currentUser !== this.state.currentUser;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({currentUser: auth().currentUser});
    }

    render() {
        return (
            <div className='site-card-border-less-wrapper'>
                <Row justify='end' gutter={[0, 20]} align='middle'>
                    {/*Login bar and ect...*/}
                    <Col span={24} style={{background: 'white'}}>
                        <br/>
                        <MenuBar currentUser={this.state.currentUser}/>
                    </Col>
                </Row>
                <br/>
                {/*Main stocks*/}
                <Row justify='center' gutter={this.state.borders}>
                    <Col span={20}>
                        <StockList/>
                    </Col>
                </Row>
                <br/>
                <Row justify='center' gutter={this.state.borders}>
                    {/*Breakdown %*/}

                    <Col className='gutter-row' span={4}>
                        <CatagoryRadar/>
                    </Col>
                    <Col className='gutter-row' span={4}>
                        <LocationDonut/>
                    </Col>
                    <Col className='gutter-row' span={12}>
                        <StockList/>
                    </Col>
                </Row>


            </div>
        );
    }
}