import React, { Component } from 'react';
import { Row, Col, message, Card } from 'antd';
import StockList from "../components/Portfolio/stocklist";
import LocationDonut from '../components/Portfolio/locationDonut';
import CategoryRadar from '../components/Portfolio/categoryRadar';
import { auth, realTime } from '../services/firebase';
import RecentTransactionTable from "../components/Portfolio/recentTransactionCard";
import {getMultipleTickers, getAllOf, updateMyTickers} from "../helpers/APICommunication";
import { getConversionRatio } from "../helpers/exchangeFxns";
import '../App.css';
const stonkApi = 'http://localhost:5000/stonksAPI/v1';

export default class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            borders: [8,8],
            data: [],
            originalData: [],
            currentValue: 0,
            originalBookValue: 0,
            updatingData: false,
            currentUser: null,
            currency: 'CAD',
            updatingCurrency: false
        }
    }

    componentDidMount(){

        try{
            fetch(stonkApi + '/update/world', {
                method: 'POST'
            });

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
            this.state.updatingData !== nextState.updatingData ||
            this.state.updatingCurrency !== nextState.updatingCurrency;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({currentUser: auth().currentUser}, () => {
            if (this.state.currentUser === null){
                this.setState({data: [], originalData: []});
                this.portfolioListener.off();
            }
        });

    }

    setPortfolioListener = (uid) => {
        try{
            this.portfolioListener = realTime.ref('/portfolios/' + uid).on('value', (positions) => {

                try{
                    updateMyTickers(Object.keys(positions.val()));
                    this.formatData(positions);

                } catch(error){
                    console.log(error);
                    return false
                }

            });
        } catch(error) {
            console.log(error)
        }

    }

    setPortfolio = async (portfolio, tickers) => {
        let data = [];
        // let originalBookVal = 0;
        console.log(portfolio)
        for (let i = 0; i < tickers.length; i++){
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
            data.push(position);
        }
        return data
    }

    formatData = async (positions) => {
        let portfolio = positions.val();
        let tickers = Object.keys(portfolio);
        //Set the users portfolio data before getting the live stock data
        let data = await this.setPortfolio(portfolio, tickers);

        if (this.state.updatingData === false){
            this.setState({updatingData: true}, async() => {

                try{
                    const dataList = await getMultipleTickers('current', 'tickers', tickers);

                    let stockData = {}

                    for (let i = 0; i < tickers.length; i++){
                        stockData[dataList[i]['ticker']] = dataList[i];
                    }

                    for (let i = 0; i < tickers.length; i++){

                        const t = tickers[i];
                        const stock = stockData[t.replace('_','.')];
                        console.log(portfolio, t, stockData)
                        const cv = stock['price'] * Number(portfolio[t].shares);
                        const profit = (stock.price * Number(portfolio[t].shares)) - portfolio[t].cost;

                        data[i] = {...data[i], ...stock};
                        delete data[i].price;
                        data[i].currentValue = cv;
                        data[i].profit = profit;
                        data[i].current = stock['price'];
                        data[i].profitPercent = ((profit/portfolio[t].cost) * 100).toFixed(2);
                    }

                    let returnVals = await this.calcPortfolioAsCurrency(data);
                    this.setState({updatingData:false, data: returnVals[0], originalData: data, currentValue: returnVals[2], originalBookValue: returnVals[1] });

                } catch(error) {
                    console.log(error);
                    message.error('There was an error getting live stock data.');
                    this.setState({updatingData:false, currentValue: 0, data: data, originalData:data});
                }

            })
        }
    }

    calcPortfolioAsCurrency = async (inputData) => {
        //This function is called both when format data is triggered and when set currency is triggered
        const currencyData = await getAllOf('currencies', 'object');
        let originalTotalVal = 0;
        let currentTotalVal = 0;
        let data = [];
        inputData.forEach( (position) => {
            data.push({...position});
        })

        for (let i = 0; i < data.length; i++){
            const d = data[i];

            if (this.state.currency !== 'Default'){

                if (d.currency !== this.state.currency){
                   const ratio = getConversionRatio(currencyData, d.currency, this.state.currency);

                   if (ratio === null){
                       d.cost = d.currentValue = d.profit = d.profitPercent = 0;

                   } else {
                       d.cost = d.cost * ratio;
                       d.current = d.current * ratio;
                       d.currentValue = d.currentValue * ratio;
                       d.profit = d.profit * ratio;
                   }
                }
                originalTotalVal += d.cost;//add the original value
                currentTotalVal += d.currentValue;//add the current total value

            } else {

                if (d.currency !== this.state.currency){
                    const ratio = getConversionRatio(currencyData, d.currency, 'CAD');

                    if (ratio !== null){
                        originalTotalVal += d.cost * ratio;
                        currentTotalVal += d.currentValue * ratio;
                        d.ratio = ratio;
                    }

                } else {
                    originalTotalVal += d.cost;
                    currentTotalVal += d.currentValue;
                }
            }
        }
        for (let i = 0; i < data.length; i++){
            const d = data[i];

            if (this.state.currency === 'Default'){

                if (d.currency !== 'CAD'){
                    d.portfolioPercent = (((d.currentValue * d.ratio) / currentTotalVal) * 100).toFixed(2);
                    d.originalPercent = (((d.cost * d.ratio) / originalTotalVal) * 100).toFixed(2);

                } else {
                    d.portfolioPercent = ((d.currentValue / currentTotalVal) * 100).toFixed(2);
                    d.originalPercent = ((d.cost / originalTotalVal) * 100).toFixed(2);
                }

            } else {
                d.portfolioPercent = ((d.currentValue / currentTotalVal) * 100).toFixed(2);
                d.originalPercent = ((d.cost/originalTotalVal)*100).toFixed(2);
            }
        }
        return [[...data], Number(originalTotalVal.toFixed(2)), Number(currentTotalVal.toFixed(2))];
    }


    setCurrency = (currency) => {
        //This function is only called when a user switches their currency
        const originalCurrency = this.state.currency;

        if (this.state.updatingCurrency === false){
            this.setState({updatingCurrency: true, currency: currency}, async () => {

                try{
                    const returnVals = await this.calcPortfolioAsCurrency(this.state.originalData);
                    this.setState({updatingCurrency: false, originalBookValue: returnVals[1], data: returnVals[0], currentValue: returnVals[2]})

                } catch(error) {
                    console.log(error)
                    this.setState({updatingCurrency: false, currency: originalCurrency});
                }
            });
        }
    }



    render(){

        const colSize = {
            'xs': 24,
            'sm': 24,
            'md': 24,
            'lg': 8,
        }

        return (
            <div className='routerBackground'>
                <Row justify='center' gutter={this.state.borders}>
                    <Col span={24}>
                        <StockList
                            data={this.state.data}
                            totalBookValue={this.state.originalBookValue}
                            currentTotal={this.state.currentValue}
                            setCurrency={this.setCurrency}
                            currency={this.state.currency}
                            updatingCurrency={this.state.updatingCurrency}
                        />
                    </Col>
                </Row>
                <Row  justify='center' gutter={this.state.borders}>
                    <Col  {...colSize}>
                        <CategoryRadar data={this.state.data}/>
                    </Col>
                    <Col {...colSize}>
                        <LocationDonut data={this.state.data}/>
                    </Col>
                    <Col {...colSize}>
                            <div>
                                <div className='stonkCardHeader'>
                                    <h3 style={{color: '#fff'}}>Recent Transactions</h3>
                                </div>
                                <div className='stonkCardBody'>
                                    <RecentTransactionTable
                                        data={this.state.data}
                                        singleStock={false}
                                        currency={this.state.currency}/>
                                </div>
                            </div>
                    </Col>
                </Row>
            </div>
        );
    }



}