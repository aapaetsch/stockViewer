import React, { Component } from 'react';
import { Row, Col, Button, message, notification, Skeleton, Card} from 'antd';
import StockList from "../components/Portfolio/stocklist";
import LocationDonut from '../components/Portfolio/locationDonut';
import CategoryRadar from '../components/Portfolio/categoryRadar';
import { getPortfolio } from '../helpers/rtdbCommunication';
import { auth, realTime } from '../services/firebase';
import 'antd/dist/antd.css';
import '../styles/portfolio.css';
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
            currentUser: null
        }
        this.formatData = this.formatData.bind(this);
    }

    componentDidMount(){
        console.log(auth().currentUser);
        fetch(stonkApi + '/update').then( () => {
            this.setPortfolioListener(auth().currentUser.uid);
        });
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

    async formatData(positions) {
        let portfolio = positions.val();
        let tickers = Object.keys(portfolio);

        if (this.state.updatingData === false){
            this.setState({updatingData: true}, async() => {
               // do some data crunching
                const res = await fetch(`${stonkApi}/current/multiple?tickers=${tickers}`);
                const dataList = await res.json();
                let currentValues = {};
                console.log(dataList);
                for(let i = 0; i < tickers.length; i++){
                    currentValues[dataList[i]['ticker'].replace('.','_')] = dataList[i];
                }

                let data = [];
                let originalValue = 0;
                let currentTotalValue = 0;

                for (let i = 0; i < tickers.length; i++){
                    let t = tickers[i];
                    let resData = currentValues[t];

                    if (dataList){
                        const cv = resData['price'] * Number(portfolio[t].shares);
                        currentTotalValue += cv;
                        originalValue += Number(portfolio[t].cost);
                        const profit = (resData['price'] * Number(portfolio[t].shares)) - portfolio[t].cost;
                        let position = {
                            ticker: t.replace('_', '.'),
                            category: portfolio[t].category,
                            portfolioPercent: 0,
                            originalPercent: 0,
                            current: resData['price'].toFixed(2),
                            shares: portfolio[t].shares,
                            bookValue: portfolio[t].cost.toFixed(2),
                            currentValue: cv.toFixed(2),
                            profit: profit.toFixed(2),
                            profitPercent: ((profit/portfolio[t].cost) * 100).toFixed(2),
                            dayPercent: resData['changePercent'],
                            title: resData['title'],
                            currency: resData['currency'],
                            location: resData['location']
                        }
                        data.push(position);
                        // this.setState({data:data});
                    }
                }
                for (let i = 0; i < data.length; i++){
                    data[i].portfolioPercent = ((data[i].currentValue / currentTotalValue)*100).toFixed(2);
                    data[i].originalPercent = ((data[i].bookValue / originalValue)*100).toFixed(2);
                }
                this.setState({updatingData:false, data: data, originalBookValue: originalValue, currentValue: currentTotalValue});
            });
        }
    }




    render(){
        return (
            <div className='portfolioBackground'>
                <Row justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={24}>
                        <StockList
                            data={this.state.data}
                            totalBookValue={this.state.originalBookValue}
                            currentTotal={this.state.currentValue}
                        />
                    </Col>
                </Row>
                <Row justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' col={1}>
                        <Card title='buy sell fxns'>

                        </Card>
                    </Col>
                    <Col className='gutter-row' col={6}>
                        <CategoryRadar data={this.state.data}/>
                    </Col>
                    <Col className='gutter-row' col={6}>
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