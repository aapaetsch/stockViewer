import React, { Component, createRef } from 'react';
import { Row, Col, Carousel, Button } from 'antd';
import { getMultipleTickers, getAllOf } from "../helpers/APICommunication";
import { CardCarousel } from "../components/world/cardCarouselComponents";
import '../App.css';
import StockDataDisplay from "../popups/stockPopup";
const stonkApi = 'http://localhost:5000/stonksAPI/v1';

export default class WorldStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            borders: [8,8],
            data: [],
            currencyData: [null, null, null, null],
            indicieData: [null, null, null, null],
            stockDisplayData: {},
            showStockPopup: false,
            // updatingData: false,
        }
        this.getCurrencyStats = this.getCurrencyStats.bind(this);
        this.getIndicieStats = this.getIndicieStats.bind(this);
    }

    componentDidMount(){
        this.getCurrencyStats();
        this.getIndicieStats();
    }

    async getCurrencyStats(){
        const currencyData = await getAllOf('currencies', 'array');
        this.setState({currencyData: (currencyData !== null ?
                    (currencyData) : this.hasBadData(4)
            )});
    }

    async getIndicieStats(){
        const indexData = await getAllOf('indicies', 'array');
        this.setState({indicieData: (indexData !== null ?
                (indexData) : this.hasBadData(4)
            )});
    }

    hasBadData = (amount) => {
        let data = [];
        for (let i = 0; i < amount; i++){
            data.push(null);
        }
        return data;
    }

    openStockPopup = (data) => {
        console.log(data)
        this.setState({stockDisplayData: data, showStockPopup: true});
    }

    closeStockPopup = () => {
        this.setState({stockDisplayData: {}, showStockPopup: false});
    }

    render() {
        return (
            <div className='routerBackground'>
                <CardCarousel onClick={this.openStockPopup} data={this.state.indicieData} type='index'/>
                <CardCarousel onClick={this.openStockPopup} data={this.state.currencyData} type='exchange'/>
                <StockDataDisplay
                    close={this.closeStockPopup}
                    owned={false}
                    data={this.state.stockDisplayData}
                    visible={this.state.showStockPopup}
                    />
            </div>
        );
    }

}

