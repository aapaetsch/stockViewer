import React, { Component } from 'react';
import {Row, Col, Table, Select, Space, notification, Skeleton, Modal} from 'antd';
import { auth } from '../../services/firebase';
import AddStock from "../../popups/addStock";
import { getCurrencySymbol } from "../../helpers/exchangeFxns";
import StockDataDisplay from "../../popups/stockPopup";
import '../../App.css';
import { PlusOutlined } from '@ant-design/icons';


const { Option } = Select;

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
            showStockPopup: false,
            stockDisplayData: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext){
        return this.props.data !== nextProps.data
            || this.props.currency !== nextProps.currency
            || this.props.updatingCurrency !== nextProps.updatingCurrency
            || this.state.showStockPopup !== nextState.showStockPopup
            || this.state.showLoading !== nextState.showLoading;
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
    handleCurrencyChange = (value) => {

        if (value === 'Default'){
            notification['warning']({
                message:'Warning: Default Currency Selected',
                description: 'If the portfolio has more than one currency, totals will be in $CAD.'
            });
        }
        this.props.setCurrency(value);
    }

    openStockPopup = (data) => {
        this.setState({stockDisplayData: data, showStockPopup: true});
    }

    closeStockPopup = () => {
        this.setState({stockDisplayData: {}, showStockPopup: false});
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
                    compare:  (a,b) => b.current - a.current,
                    multiple: 2,
                },
                render: (text, position) => {
                    return<span>
                        {this.props.currency === 'Default' ?
                            (getCurrencySymbol(position.currency)) :
                            (getCurrencySymbol(this.props.currency))
                        }
                        {parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                }
            },
            {
                title: 'Shares', dataIndex: 'shares'
            },
            {
                title: 'Book Value', dataIndex: 'cost',
                sorter: {
                    compare: (a,b) => b.cost - a.cost,
                    multiple: 3
                },
                render: (text, position) => {
                    return <span>
                        {this.props.currency === 'Default' ?
                            (getCurrencySymbol(position.currency)) :
                            (getCurrencySymbol(this.props.currency))
                        }
                        {parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                }
            },
            {
                title: 'Current Value', dataIndex: 'currentValue',
                sorter: {
                    compare: (a,b) => b.currentValue - a.currentValue,
                    multiple: 1
                },
                render: (text, position) => {
                        return <span>
                            {this.props.currency === 'Default' ?
                                (getCurrencySymbol(position.currency)) :
                                (getCurrencySymbol(this.props.currency))
                            }
                            {parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                }
            },
            {
                title: 'Profit', dataIndex: 'profit',
                render: (text, position) => {
                    return <span>
                        {this.props.currency === 'Default' ?
                            (getCurrencySymbol(position.currency)) :
                            (getCurrencySymbol(this.props.currency))
                        }
                        {parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                }
            },
            {
                title: '% Profit', dataIndex: 'profitPercent',
                render: (text) => {
                    return <span>{parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</span>;
                }
            },
        ]
        const myCardTitle = {
            'xs': 12,
            'md': 14,
            'lg': 18,
        }
        const myCardButtons = {
            'xs': 10,
            'md': 10,
            'lg': 6,
        }
        return (
            <div
                key={this.props.data}>
                <Row align='middle' className='stonkCardHeader'>
                    <Col {...myCardTitle} >
                        <h3 style={{color: '#fff'}}>Portfolio</h3>
                    </Col>
                    <Col {...myCardButtons}>
                        <Space style={{color: '#fff'}}>
                            Currency:
                            <Select defaultValue={this.props.currency}
                                    onChange={this.handleCurrencyChange}
                                    disabled={this.props.updatingCurrency}
                                    >
                                <Option value='CAD'>$ CAD</Option>
                                <Option value='USD'>$ USD</Option>
                                <Option value='GBP'>&pound; GBP</Option>
                                <Option value='JPY'>&yen; JPN</Option>
                                <Option value='EUR'>&euro; EUR</Option>
                                <Option value='CNY'>&yen; CNY</Option>
                                <Option value='Default'>Default</Option>
                            </Select>
                            &nbsp;
                            <AddStock icon={<PlusOutlined/>}
                                      buttonText=''
                                      initial={{costType: 'perShare'}}
                            />
                        </Space>
                    </Col>
                </Row>

                <div className='stonkCardBody'>
                    <Skeleton loading={this.props.data.length === 0} active>
                        <Table
                            columns={stockListColumns}
                            pagination={false}
                            scroll={{x: 1200, y:500}}
                            dataSource={this.props.data}
                            loading={this.state.showLoading}
                            size="small"
                            style={{borderRadius: '25px'}}
                            rowClassName={ (record, index) => {
                                return `${colorSwitcher(record['profitPercent'])} hoverTableRows`;
                            }}
                            onRow={ (record, rowIndex) => {
                                return {
                                    onClick: event => {
                                        this.openStockPopup(record);
                                    }
                                }
                            }}
                            summary={ () => (
                                <Table.Summary.Row style={{backgroundColor: '#fff'}}>
                                    <Table.Summary.Cell index={0} style={{backgroundColor: '#f5f5f5'}}>{`Total`}</Table.Summary.Cell>
                                    <Table.Summary.Cell/><Table.Summary.Cell/><Table.Summary.Cell/><Table.Summary.Cell/>
                                    <Table.Summary.Cell index={5}>
                                        {this.props.currency === 'Default' ?
                                            (getCurrencySymbol('CAD')) :
                                            (getCurrencySymbol(this.props.currency))
                                        } {this.props.totalBookValue.toFixed(2)
                                        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}>
                                        {this.props.currency === 'Default' ?
                                            (getCurrencySymbol('CAD')) :
                                            (getCurrencySymbol(this.props.currency))
                                        } {this.props.currentTotal.toFixed(2)
                                        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7}>
                                        {this.props.currency === 'Default' ?
                                            (getCurrencySymbol('CAD')) :
                                            (getCurrencySymbol(this.props.currency))
                                        } {(this.props.currentTotal - this.props.totalBookValue).toFixed(2)
                                        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8}>
                                        {((this.props.currentTotal/this.props.totalBookValue) * 100).toFixed(2)} %
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </Skeleton>
                </div>
                <StockDataDisplay
                    close={this.closeStockPopup}
                    data={this.state.stockDisplayData}
                    visible={this.state.showStockPopup}
                    owned={true}/>
            </div>
        );
    }
}