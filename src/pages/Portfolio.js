import React, { Component } from 'react';
import { Row, Col, Button, message, notification, Skeleton, Card} from 'antd';
import StockList from "../components/Portfolio/stocklist";
import LocationDonut from '../components/Portfolio/locationDonut';
import CategoryRadar from '../components/Portfolio/categoryRadar';
import { auth, realTime } from '../services/firebase';
import 'antd/dist/antd.css';
import '../styles/portfolio.css';
import RecentTransactionCard from "../components/Portfolio/recentTransactionCard";
import {getMultipleTickers} from "../helpers/rtdbCommunication";
const stonkApi = 'http://localhost:5000/stonksAPI/v1';

export default class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            borders: [8,8],
            data: [],
            currentValue: 0,
            originalBookValue: 0,
            updatingData: false,
            currentUser: null,
            currency: 'CAD'
        }
        this.formatData = this.formatData.bind(this);
    }

    componentDidMount(){
        console.log(auth().currentUser);
        try{
            fetch(stonkApi + '/update');
        } catch (error){
            console.log('Error: failed to fetch from api');
            message.error('There was an error getting live stock data');
        }
        this.setPortfolioListener(auth().currentUser.uid);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps ||
            this.state.data !== nextState.data ||
            this.state.currentUser !== nextState.currentUser ||
            this.state.updatingData !== nextState.updatingData;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({currentUser: auth().currentUser}, () => {
            if (this.state.currentUser === null){
                this.setState({data: []});
                this.portfolioListener.off();
            }
        });

    }

    setPortfolioListener = (uid) => {
        this.portfolioListener = realTime.ref('/portfolios/' + uid).on('value', (positions) => {
            this.formatData(positions);
        });
    }

    async formatData(positions){
        let portfolio = positions.val();
        let tickers = Object.keys(portfolio);
        //Set the users portfolio data before getting the live stock data
        let data = await this.setPortfolio(portfolio, tickers);
        console.log(data);
        if (this.state.updatingData === false){
            this.setState({updatingData: true}, async() => {
                try{
                    // const result = await fetch(`${stonkApi}/current/multiple?tickers=${tickers}`);
                    // const dataList = await result.json();
                    const dataList = await getMultipleTickers('current', 'tickers', tickers);

                    let stockData = {}
                    let currentTotalValue = 0;

                    for (let i = 0; i < tickers.length; i++){
                        stockData[dataList[i]['ticker']] = dataList[i];
                    }

                    for (let i = 0; i < tickers.length; i++){

                        const t = tickers[i];
                        const stock = stockData[t.replace('_','.')];
                        console.log(portfolio, t, stockData)
                        const cv = stock['price'] * Number(portfolio[t].shares);
                        const profit = (stock.price * Number(portfolio[t].shares)) - portfolio[t].cost;
                        currentTotalValue += cv;

                        data[i] = {...data[i], ...stock};
                        delete data[i].price;
                        data[i].currentValue = cv.toFixed(2);
                        data[i].profit = profit.toFixed(2);
                        data[i].current = stock['price'].toFixed(2);
                        data[i].profitPercent = ((profit/portfolio[t].cost) * 100).toFixed(2);
                    }

                    for (let i = 0; i < data.length; i++){
                        data[i].portfolioPercent = ((data[i].currentValue / currentTotalValue)*100).toFixed(2);
                        data[i].originalPercent = ((data[i].cost / this.state.originalBookValue)*100).toFixed(2);
                    }
                    console.log(data);

                    this.setState({updatingData:false, data: data, currentValue: currentTotalValue});

                } catch(error) {
                    console.log(error);
                    message.error('There was an error getting live stock data.');
                    this.setState({updatingData:false, currentValue: 0});
                }

            })
        }
    }

    async setPortfolio(portfolio, tickers){
        let data = [];
        let originalBookVal = 0;
        // console.log(portfolio)
        for (let i = 0; i < tickers.length; i++){
            originalBookVal += portfolio[tickers[i]]['cost']
            let position = {
                ...portfolio[tickers[i]],
                ticker: tickers[i].replace('_','.'),
                key: tickers[i].replace('_','.'),
                portfolioPercent: 0,
                originalPercent: 0,
                current: 0.00,
                currentValue: 0.00,
                profit: 0.00,
                profitPercent: 0.00,
                changePercent: 0.00,
                title: 'Unknown',
                currency: 'Unknown',
                exchange: 'Unknown'
            }
            position.cost = position.cost.toFixed(2);
            data.push(position);
        }
        this.setState({originalBookValue:originalBookVal});
        return data
    }

    setCurrency = (currency) => {
        console.log(currency);
        //todo: add switch for currency

    }

    render(){
        return (
            <div className='routerBackground'>
                <Row justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={24}>
                        <StockList
                            data={this.state.data}
                            totalBookValue={this.state.originalBookValue}
                            currentTotal={this.state.currentValue}
                            setCurrency={this.setCurrency}
                        />
                    </Col>
                </Row>
                <Row className='gutter-row' justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={1}>
                        <Card title='buy sell fxns'>

                        </Card>
                    </Col>
                    <Col className='gutter-row' span={6}>
                        <CategoryRadar data={this.state.data}/>
                    </Col>
                    <Col className='gutter-row' span={6}>
                        <LocationDonut data={this.state.data}/>
                    </Col>
                    <Col span={7}>
                        <RecentTransactionCard data={this.state.data}/>
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