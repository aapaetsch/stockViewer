import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import 'antd/dist/antd.css';
import '../styles/portfolio.css';
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
        this.formatCurrencies = this.formatCurrencies.bind(this);
        this.formatIndicies = this.formatIndicies.bind(this);
    }

    componentDidMount(){

    }

    async formatCurrencies(){
        try{
            const mainCurrencies = ['CADUSD=X', 'CADEUR=X', 'CADGBP=X'];
            const response = await fetch(`${stonkApi}/currencies/multiple?currencies=${mainCurrencies.toString()}`);
            const data = await response.json();

        } catch(error) {
            console.log(error);
            message.error('There was an error retrieving live currency data.')
            return false;
        }
    }

    async formatIndicies(){
        try{
            const mainIndicies = ["^GSPTSE", "^GSPC", "^DJI", "^IXIC"];
            const response = await fetch(`${stonkApi}/indicies/multiple?indicies=${mainIndicies.toString()}`)
            const data = await response.json();

            return true
        } catch(error){
            console.log(error);
            message.error('There was an error retrieving live Index data')
            return false;
        }

    }

    render() {
        return (
            <div>
                <Row className='gutter-row' justify='center' gutter={this.state.borders}>
                    <Col className='gutter-row' span={7}>
                            
                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>


            </div>
        );
    }
}

