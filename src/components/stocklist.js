import React, { Component } from 'react';
import { Card, Button, Row, Col, Table } from 'antd';
import { auth } from '../services/firebase'
import AddStock from "../popups/addStock";
import 'antd/dist/antd.css';
import '../App.css';
import '../styles/stocklist.css';


export default class StockList extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoading: false,
            gutterSize: [10,10],
            data: [],
            totalBookValue: 0,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext){
        return this.state.data !== nextState.data;
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        //check if there has been an update in the stocks
        // if (this.state.data !== []){
        //     this.formatTableData();
        // }
    }

    updateStocks = (parentData, parentBookValue) =>{
        this.setState({data: parentData, totalBookValue: parentBookValue});
    }

    render() {
        function colorSwitcher(int) {
            const value = Number(int);
            if (value >= 100){
                return 'largePositive';
            } else if (value > 25){
                return 'mediumPositive';
            } else if (value < 0){
                return 'negative';
            } else {
                return 'smallPositive';
            }
        }
        const stockListColumns = [
            {
                title: 'Ticker', dataIndex: 'ticker', fixed: 'left'
            },
            {
                title: 'Market Sector', dataIndex: 'category'
            },
            {
                title: '% Portfolio', dataIndex: 'portfolioPercent',
                render: (text) => {
                    return <span>{parseFloat(text).toFixed(2)} %</span>
                }
            },
            {
                title: 'Current Price', dataIndex: 'current',
            },
            {
                title: 'Shares', dataIndex: 'shares'
            },
            {
                title: 'Book Value', dataIndex: 'bookValue',
                render: (text) => {
                    return <span>$ {text}</span>
                }
            },
            {
                title: 'Current Value', dataIndex: 'currentValue'
            },
            {
                title: 'Profit', dataIndex: 'profit'
            },
            {
                title: '% Profit', dataIndex: 'profitPercent',
                render: (text) => {
                    return <span className={colorSwitcher(text)}>{text}%</span>;
                }
            },
        ]

        return (
          <div>

              <Card title='Stocks List' extra={<AddStock/>}>
                  <Row gutter={this.state.gutterSize} justify='center'>
                      <Table
                          columns={stockListColumns}
                          pagination={{pageSize: 100}}
                          scroll={{x: 1500, y:240}}
                          dataSource={this.state.data}
                          />
                  </Row>
                  <Row justify='end' align='middle'>
                      <Col span={24}>
                          <span>Total Book Value: ${this.state.totalBookValue}</span>
                      </Col>
                  </Row>

              </Card>
          </div>
        );
    }
}