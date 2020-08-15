import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import {getMultipleTickers} from "../helpers/rtdbCommunication";
import WorldStatInfoCard from "../components/stockInfoCard";
import 'antd/dist/antd.css';
import '../App.css';
const stonkApi = 'http://localhost:5000/stonksAPI/v1';

export default class WorldStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            borders: [8,8],
            data: [],
            currencyData: [],
            indicieData: [],
            // updatingData: false,
        }
        this.formatMainStats = this.formatMainStats.bind(this);
    }

    componentDidMount(){
        this.formatMainStats();
    }

    async formatMainStats() {
        console.log('start');
        const mainCurrencies = ['CADUSD=X', 'CADEUR=X', 'CADGBP=X'];
        const currencyData = await getMultipleTickers('currencies', 'currencies', mainCurrencies);
        console.log(currencyData);
        const mainIndicies = ["^GSPTSE", "^GSPC", "^DJI", "^IXIC"];
        const indexData = await getMultipleTickers('indicies', 'indicies', mainIndicies);
        console.log(indexData);
        this.setState({currencyData: (currencyData !== null ? (currencyData) : ([])),
            indicieData: (indexData !== null ? (indexData) : ([]))
        });
    }

    render() {
        function statCards(dataSource, borders){
            const cards = dataSource.map( (stat) =>
                <Col flex={1}>
                    <WorldStatInfoCard data={stat}/>
                </Col>);

            return (
                <Row className='gutter-row' justify='center' align='middle' gutter={borders}>
                    {cards}
                </Row>
            );
        }
        return (
            <div className='routerBackground'>
                {statCards(this.state.indicieData, this.state.borders)}
                {statCards(this.state.currencyData, this.state.borders)}
            </div>
        );
    }
}

