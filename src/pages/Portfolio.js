import React, { Component } from 'react';
import { Row, Col, Button, message, notification, Skeleton, Card} from 'antd';
import StockList from "../components/Portfolio/stocklist";
import LocationDonut from '../components/Portfolio/locationDonut';
import CategoryRadar from '../components/Portfolio/categoryRadar';
import { getPortfolio } from '../helpers/rtdbCommunication';
import { auth, realTime } from '../services/firebase';
import 'antd/dist/antd.css';
import '../styles/portfolio.css';

export default class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            borders: [8,8],
            data: [],
            totalBookValue: 0,
            currentUser: null
        }
        this.formatData = this.formatData.bind(this);
    }

    componentDidMount(){
        console.log(auth().currentUser);
        this.setPortfolioListener(auth().currentUser.uid);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps ||
            this.state.data !== nextState.data ||
            this.state.currentUser !== nextState.currentUser;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({currentUser: auth().currentUser}, () => {
            if (this.state.currentUser === null){
                this.setState({data: []});
                this.portfolioListener.off();
            } else if (this.state.currentUser !== prevState.currentUser) {
                this.setPortfolioListener(auth().currentUser.uid);
            }
        });

    }

    componentWillUnmount() {
        this.portfolioListener.off()
    }

    setPortfolioListener = (uid) => {
        this.portfolioListener = realTime.ref('/portfolios/' + uid).on('value', (positions) => {
            this.formatData(positions);
        });
    }

    formatData(positions) {
        console.log(positions);
    }




    render(){
        return (
            <div className='portfolioBackground'>
                <Row justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={24}>
                        <StockList data={this.state.data} totalBookValue={this.state.totalBookValue}/>
                    </Col>
                </Row>
                <Row justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={6}>
                        <Card title='buy sell fxns'>

                        </Card>
                    </Col>
                    <Col className='gutter-row' span={9}>
                        <CategoryRadar data={this.state.data}/>
                    </Col>
                    <Col className='gutter-row' span={9}>
                        <LocationDonut data={this.state.data}/>
                    </Col>
                </Row>
                <Row justify='center' gutter={this.state.borders}>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </div>
        );
    }



}