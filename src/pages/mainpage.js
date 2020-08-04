import React, { Component } from 'react';
import {Row, Col, Button, message, notification, Skeleton, Card} from 'antd';
import StockList from "../components/Portfolio/stocklist";
import MenuBar from "../components/menubar";
import 'antd/dist/antd.css';
import '../App.css';
import LocationDonut from "../components/Portfolio/locationDonut";
import CategoryRadar from "../components/Portfolio/categoryRadar";
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
            marketSectors: ['Technology', 'Communication', 'Energy', 'Financial',
                'Healthcare','Industrial', 'Consumer Staple','Consumer Discretionary',
                'International','Misc', 'Utilities', 'Materials',  'Real Estate'],
            exchangeLocation: {'xtse':'Canada', 'US':'US'},
        }
        this.stockListComponent = React.createRef();
        this.formatStockData = this.formatStockData.bind(this);
        this.addStockData = this.addStockData.bind(this);
        // this.categoryRadarComponent = React.createRef();
        // this.locationDonutComponent = React.createRef();
        // this.updateChildren = this.updateChildren.bind(this);
    }


    componentDidMount(){
        this.setState({
            currentUser: this.props.currentUser,
        });
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps || this.state !== nextState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps){
            this.setState({currentUser: this.props.currentUser}, () =>{
                if (this.state.currentUser !== null){
                    this.setUserStocks();
                } else {
                    this.resetPage(this.state.user);
                }
            });
        }

    }

    resetPage = (user) => {
        this.setState({
            data: [],
            currentUser: user,
            totalBookValue: 0,
            stocks: null,
        });
    // , () => {
    //         this.stockListComponent.current.updateStocks(this.state.data, this.state.totalBookValue);
    //     // }
    }

    setUserStocks = () => {
        getPortfolio().then( (result) => {
            if (result !== null){
                this.setState({stocks: result}, ()=>{
                    this.formatStockData().then( (dataResult) => {
                        this.setState({data: dataResult}, () => console.log(this.state.data));
                        // this.stockListComponent.current.updateStocks(dataResult, this.state.totalBookValue);

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
                category: data.category,
                bookValue: data.cost,
                originalPercent: (data.cost/totalBookValue) * 100,
                portfolioPercent: (data.cost/totalBookValue) * 100,
            }
            stockData.push(stock);
        });
        return stockData;
    }

    async addStockData(values, totalCost){
        try{
            let newData = [...this.state.data];
            const cost = Number(totalCost);
            let newShares = Number(values.shares);
            const newTotalValue = Number(this.state.totalBookValue) + cost;
            let stockExists = false;
            let newBookValue = cost;
            let payload = [];

            for (let i = 0; i < this.state.data.length; i++){
                if (this.state.data[i].ticker === values.ticker){

                    stockExists = i;
                    newBookValue = cost + Number(this.state.data[i].bookValue);
                    newShares += Number(this.state.data[i].shares);
                    payload = [values.ticker,
                        [this.state.data[i].shares, values.shares], newBookValue,
                        [this.state.data[i].category, values.category]];

                } else {
                    newData[i].originalPercent = (this.state.data[i].bookValue/newTotalValue)*100;
                    newData[i].portfolioPercent = (this.state.data[i].bookValue/newTotalValue)*100;
                }
            }
            let stock = {
                ticker: values.ticker,
                shares: newShares,
                bookValue: newBookValue,
                category: values.category,
                originalPercent: (newBookValue / newTotalValue) * 100,
                portfolioPercent: (newBookValue / newTotalValue) * 100,
            }

            if (stockExists !== false){
                newData[stockExists] = stock;
            } else {
                newData.push(stock);
            }

            this.setState({data: newData, totalBookValue: newTotalValue});
            return [true, payload];

        } catch(error){
            console.log(error);
            return [false, null];
        }
    }

    render() {
        return (
            <div className='site-card-border-less-wrapper'>
                <br/>
                {/*Main stocks*/}
                <Row justify='center' gutter={this.state.borders}>
                    <Col span={20}>
                        <StockList
                            // ref={this.stockListComponent}
                            updateParentData={this.addStockData}
                            data={this.state.data}
                            totalBookValue={this.state.totalBookValue}
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
                    <Col className='gutter-row' span={8}>
                        <CategoryRadar data={this.state.data} marketSectors={this.state.marketSectors}/>
                    </Col>
                    <Col className='gutter-row' span={6}>
                        <LocationDonut data={this.state.data} exchangeLocation={this.state.exchangeLocation}/>
                    </Col>
                </Row>
            </div>
        );
    }
}