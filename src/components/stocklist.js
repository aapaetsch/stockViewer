import React, { Component } from 'react';
import { Card, Button, Row, Col, Table } from 'antd';
import AddStock from "../popups/addStock";
import 'antd/dist/antd.css';
import '../App.css';
import '../styles/stocklist.css';

export default class StockList extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoading: false,
        }
    }




    render() {
        const cols = [
            {title: 'Category', dataIndex: 'category'},
            {title: '% Portfolio', dataIndex: 'portfolio%'},
            {title: 'Ticker', dataIndex: 'ticker'},
            {title: 'Current Price', dataIndex: 'current'},
            {title: 'Shares', dataIndex: 'shares'},
            {title: 'Book Value', dataIndex: 'bookvalue'},
            {title: 'Current Value', dataIndex: 'currentvalue'},
            {title: 'Profit', dataIndex: 'profit'},
            {title: '% Profit', dataIndex: 'profit%'}
        ]

        return (
          <div>

              <Card title='Stocks List' extra={<AddStock/>}>
                  <Row gutter={this.state.gutterSize} justify='center'>
                      <Table
                          columns={cols}
                          pagination={{pageSize: 100}}
                          scroll={{y:240}}
                          />
                  </Row>
                  <Row>
                      <Col span={24}>
                          <p>A bunch of values from the stock list above</p>
                      </Col>
                  </Row>

              </Card>
          </div>
        );
    }
}