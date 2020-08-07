import React, { Component } from 'react';
import { Card, Button, Row, Col, Table, Descriptions } from 'antd';
import { auth } from '../../services/firebase';
 import AddStock from "../../popups/addStock";
import 'antd/dist/antd.css';
import '../../App.css';
import '../../styles/portfolio.css';
import TableInternal from "./tableInternal";


export default class StockList extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoading: false,
            gutterSize: [10,10],
            // data: [],
            // totalBookValue: 0,

        }
        // this.updateStocks = this.updateStocks.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext){
        return this.props !== nextProps || this.state.showLoading !== nextState.showLoading;
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.props.data.length === 0 && auth().currentUser !== null) {
            this.setState({showLoading: true});
        } else {
            this.setState({showLoading: false})
        }

    }
    //
    // async updateStocks(parentData, parentBookValue) {
    //     this.setState({data: parentData, totalBookValue: parentBookValue});
    // }


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
                title: '% Portfolio', dataIndex: 'portfolioPercent', fixed: 'left',
                render: (text) => {
                    return <span>{text} %</span>
                }
            },
            {
                title: 'Ticker', dataIndex: 'ticker', fixed: 'left',
                render: (text) => {
                    return <span>{text.toUpperCase()}</span>
                }
            },
            {
                title: 'Market Sector', dataIndex: 'category'
            },
            {
                title: 'Current Price', dataIndex: 'current',
                render: (text) => {
                    return <span>$ {text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Shares', dataIndex: 'shares'
            },
            {
                title: 'Book Value', dataIndex: 'bookValue',
                render: (text) => {
                    return <span>$ {text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Current Value', dataIndex: 'currentValue',
                render: (text) => {
                    return <span>$ {text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Profit', dataIndex: 'profit',
                render: (text) => {
                    return <span>$ {text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: '% Profit', dataIndex: 'profitPercent',
                render: (text) => {
                    return <span>{text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</span>;
                }
            },
        ]

        return (
          <div>

              <Card title='Stocks List' extra={<AddStock updateMainData={this.props.updateParentData}/>}>
                  <Row gutter={this.state.gutterSize} justify='center'>
                      <Table
                          rowClassName={ (record, index) => {
                              let background = 'evenRow';
                              if (index % 2 === 1){
                                  background = 'alternateRow'
                              }
                              return `${background} ${colorSwitcher(record['profitPercent'])}`;
                          }}
                          expandable={{
                              expandedRowRender: (record, index) => {
                                  return <TableInternal data={record}/>
                              },
                          }}

                          columns={stockListColumns}
                          pagination={{pageSize: 100}}
                          scroll={{x: 1000, y:300}}
                          dataSource={this.props.data}
                          loading={this.state.showLoading}
                          size="small"
                          bordered={true}
                          summary={ () => (
                              <Table.Summary.Row style={{backgroundColor: '#f0f0f0'}} >
                                  <Table.Summary.Cell index={1} colRow={3}>Totals</Table.Summary.Cell>
                                  <Table.Summary.Cell/><Table.Summary.Cell/><Table.Summary.Cell/><Table.Summary.Cell/><Table.Summary.Cell/>
                                  <Table.Summary.Cell index={6}>
                                      $ {this.props.totalBookValue}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell index={7}>$ {this.props.currentTotal}</Table.Summary.Cell>
                                  <Table.Summary.Cell index={8}>$ {this.props.currentTotal - this.props.totalBookValue }</Table.Summary.Cell>
                                  <Table.Summary.Cell index={9}>{((this.props.currentTotal/this.props.totalBookValue) * 100).toFixed(2)} %</Table.Summary.Cell>
                              </Table.Summary.Row>
                          )}
                          />
                  </Row>
              </Card>
          </div>
        );
    }
}