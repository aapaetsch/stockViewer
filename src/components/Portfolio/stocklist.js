import React, { Component } from 'react';
import { Card, Button, Row, Col, Table, Descriptions,Switch, Space } from 'antd';
import { auth } from '../../services/firebase';
import AddStock from "../../popups/addStock";
import 'antd/dist/antd.css';
import '../../App.css';
import TableInternal from "./tableInternal";

const sectors = [
    {value:'Technology', text:'Technology'},
    {value:'Communication', text:'Communication'},
    {value: 'Consumer Discretionary', text: 'Consumer Discretionary'},
    {value: 'Consumer Staple', text: 'Consumer Staple'},
    {value: 'Energy', text:'Energy'},
    {value: 'Financial', text: 'Financial'},
    {value: 'Healthcare', text: 'Healthcare'},
    {value: 'Industrial', text: 'Industrial'},
    {value: 'Materials', text:'Materials'},
    {value: 'Real Estate', text:'Real Estate'},
    {value: 'Utilities', text: 'Utilities'},
    {value: 'International', text: 'International'},
    {value: 'Misc', text: 'Misc'}
]
export default class StockList extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLoading: false,
            gutterSize: [10,10],


        }
        // this.updateStocks = this.updateStocks.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext){
        return this.props.data !== nextProps.data || this.state.showLoading !== nextState.showLoading;
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
        function sectorValue(word) {
            let val = 0;
            for (let i =0; i < word.length; i++){
                val += word.charCodeAt(i);
            }
            return val;
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
                title: 'Market Sector', dataIndex: 'category',
                sorter: (a,b) => sectorValue(a.category) - sectorValue(b.category),
                filters: sectors,
                onFilter: (value, record) => record.category.indexOf(value) === 0,
            },
            {
                title: 'Current Price', dataIndex: 'current',
                sorter:{
                    compare:  (a,b) => a.current - b.current,
                    multiple: 2,
                },
                render: (text) => {
                    return <span>$ {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Shares', dataIndex: 'shares'
            },
            {
                title: 'Book Value', dataIndex: 'cost',
                sorter: {
                    compare: (a,b) => a.cost - b.cost,
                    multiple: 3
                },
                render: (text) => {
                    return <span>$ {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Current Value', dataIndex: 'currentValue',
                sorter: {
                    compare: (a,b) => a.currentValue - b.currentValue,
                    multiple: 1
                },
                render: (text) => {
                        return <span>$ {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: 'Profit', dataIndex: 'profit',
                render: (text) => {
                    return <span>$ {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                }
            },
            {
                title: '% Profit', dataIndex: 'profitPercent',
                render: (text) => {
                    return <span>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</span>;
                }
            },
        ]

        return (
          <div key={this.props.data}>

              <Card title='Stocks List' className='cardRounded' extra={
                  <Space>
                      Currency:
                      <Switch checkedChildren={'CAD'} unCheckedChildren={'USD'} defaultChecked
                              onChange={this.props.setCurrency}/>
                              &nbsp;
                      <AddStock updateMainData={this.props.updateParentData}/>
                  </Space>
                    }>

                  <Row gutter={this.state.gutterSize} justify='center'>
                      <Table
                          rowClassName={ (record, index) => {
                              return `${colorSwitcher(record['profitPercent'])}`;
                          }}
                          expandable={{
                              expandedRowRender: (record, index) => {
                                  return <TableInternal data={record}/>
                              },
                              expandRowByClick: true
                          }}

                          columns={stockListColumns}
                          pagination={{pageSize: 100}}
                          scroll={{x: 1000, y:300}}
                          dataSource={this.props.data}
                          loading={this.state.showLoading}
                          size="small"
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