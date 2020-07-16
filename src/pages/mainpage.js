import React, { Component } from 'react';
import {Row, Col, Button, message, notification, Skeleton, Card} from 'antd';
import StockList from "../components/stocklist";
import MenuBar from "../components/menubar";
import 'antd/dist/antd.css';
import '../App.css';
import LocationDonut from "../components/locationDonut";
import CategoryRadar from "../components/categoryRadar";
import { auth } from '../services/firebase';
import {getPortfolio} from "../helpers/firebaseCommunication";


export default class MainPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            borders: [16,16],
            stocks: null,
            currentUser: null,
            data: [],
            totalBookValue: 0,
        }
        this.stockListComponent = React.createRef();
        this.formatStockData = this.formatStockData.bind(this);
    }


    componentDidMount(){
        this.setState({
            currentUser: this.props.currentUser,
        });
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const user = this.props.currentUser;
        this.setState({currentUser: user});
        if (user !== null){
            this.setUserStocks();
        } else {
            this.resetPage(user);
        }
    }

    resetPage = (user) => {
        this.setState({
            data: [],
            currentUser: user,
            totalBookValue: 0,
            stocks: null,
        }, () => {
            this.stockListComponent.current.updateStocks(this.state.data, this.state.totalBookValue);
        });
    }

    setUserStocks = () => {
        getPortfolio().then( (result) => {
            if (result !== null){
                this.setState({stocks: result}, ()=>{
                    this.formatStockData().then( (stockResult) => {
                        this.stockListComponent.current.updateStocks(stockResult, this.state.totalBookValue);
                        this.setState({data: stockResult});
                    });
                });
            } else {
                notification['error']({
                    message: 'Error Retrieving Portfolio',
                    description: 'User has added no stocks or there was an error in retrieving the users portfolio.'
                });
            }
        });
    }

    async formatStockData() {

        let stockData = [];
        let totalBookValue = 0;

        this.state.stocks.forEach( (doc) => {
            totalBookValue += doc.data().cost;
        } );
        this.setState({ totalBookValue: totalBookValue});

        this.state.stocks.forEach( (doc) => {

            const data = doc.data();
            const stock = {
                ticker: doc.id,
                shares: data.shares,
                exchange: data.exchange,
                category: data.category,
                bookValue: data.cost,
                originalPercent: (data.cost/totalBookValue) * 100,
                portfolioPercent: (data.cost/totalBookValue) * 100,
            }
            stockData.push(stock);
        });
        return stockData;
    }


    render() {
        return (
            <div className='site-card-border-less-wrapper'>
                <br/>
                {/*Main stocks*/}
                <Row justify='center' gutter={this.state.borders}>
                    <Col span={20}>
                        <StockList
                            ref={this.stockListComponent}
                        />
                    </Col>
                </Row>
                <br/>
                <Row justify='center' gutter={this.state.borders}>
                    {/*Breakdown %*/}
                    <Col className='gutter-row' span={4}>
                        <Card title='buy sell functions'>

                        </Card>
                    </Col>
                    <Col className='gutter-row' span={9}>
                        <CategoryRadar data={this.state.data}/>
                    </Col>
                    <Col className='gutter-row' span={4}>
                        {/*<LocationDonut/>*/}
                    </Col>
                </Row>
            </div>
        );
    }
}