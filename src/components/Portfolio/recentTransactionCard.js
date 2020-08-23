import React, {Component} from 'react';
import {Table, DatePicker } from 'antd';
import {getConversionRatio, getCurrencySymbol} from "../../helpers/exchangeFxns";
import { getAllOf } from "../../helpers/APICommunication";
import '../../App.css';
const { RangePicker } = DatePicker;

export default class RecentTransactionCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: [],
            tickers: [],
            start: null,
            end: null,
        }

    }

    componentDidMount() {
        this.sortData();
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps || this.state !== nextState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps){
            this.sortData();
        }
    }

    sortData = () => {
        if (this.state.loading === false && this.props.data.length !== 0){
            this.setState({loading: true}, async () => {
                const currencyData = await getAllOf('currencies', 'object');
                let data = [];
                let tickers = [];

                try {
                    for (let i = 0; i < this.props.data.length; i++) {
                        const transactions = this.props.data[i].transactions;
                        const transactKeys = Object.keys(transactions);
                        tickers.push({value: this.props.data[i].ticker, text: this.props.data[i].ticker});

                        for (let j = 0; j < transactKeys.length; j++) {

                            let d = transactions[transactKeys[j]].date.split(' ');
                            d.splice(5,5);
                            d = d.join(' ');

                            let type;
                            let t = transactions[transactKeys[j]].transaction;
                            t.replace('$', getCurrencySymbol(this.props.data[i].currency))

                            if (t.search(/bought/i) !== -1){
                                type = 'Buy'

                            } else if (t.search(/sell/i) !== -1){
                                type = 'Sell'
                            }

                            let tList = t.split(' ');
                            let value = Number(tList[0]) * Number(tList[4].substring(1));

                            if (this.props.data[i].currency !== 'USD'){
                                const ratio = getConversionRatio(currencyData, this.props.data[i].currency, 'USD');

                                if (ratio !== null){
                                    value = value * ratio
                                }
                            }

                            data.push({
                                ticker: this.props.data[i].ticker,
                                key: i.toString() + j.toString(),
                                date: d,
                                action: t,
                                value: value,
                                type: type,
                            });
                        }

                    }

                    data.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });
                    this.setState({data: data, tickers: tickers, loading: false});

                } catch(error){
                    console.log(error);
                    this.setState({data: data, tickers: tickers, loading: false});
                }
            });
        }
    }

    onDateRangeChange = (range, rangeStrings) => {
        console.log(range, rangeStrings);
        let start;
        let end;

        if (rangeStrings[0] === ""){
            start = null

        } else {
            start = new Date(rangeStrings[0] + ' 00:00:00');
        }

        if (rangeStrings[1] === ""){
            end = null;

        } else {
            end = new Date( rangeStrings[1] + '23:59:59');
        }
        this.setState({start: start, end: end});
    }

    render(){
        const columns = [
            {
                title: 'Date', dataIndex: 'date',
                filterDropdown: () => {return <RangePicker
                                                    allowEmpty={[true, true]}
                                                    onCalendarChange={this.onDateRangeChange}/>},
                onFilter: (value, record) => {
                    let day = new Date(record.date);

                    if (this.state.start === null){
                        console.log(day, day <= this.state.end);
                        return day <= this.state.end;

                    } else if (this.state.end === null){
                        console.log(day,  day >= this.state.start);
                        return day >= this.state.start;

                    } else {
                        console.log(day, day <= this.state.end && day >= this.state.start);
                        return (day <= this.state.end && day >= this.state.start);
                    }

                },
            },
            {
                title: 'Type', dataIndex: 'type',
                filters: [{value: 'Buy', text: 'Buy'}, {value: 'Sell', text: 'Sell'}],
                onFilter: (value, record) => record.type.indexOf(value) === 0,
            },
            {
                title: 'Ticker', dataIndex: 'ticker',
                filters: this.state.tickers,
                onFilter: (value, record) => record.ticker.indexOf(value) === 0,
            },
            {
                title: 'Action', dataIndex: 'action',
                sorter: (a, b) => {
                    return b.value - a.value
                }
            }
        ]

        return (
            <div>
                <div className='stonkCardHeader'>
                    <h3 style={{color: '#fff'}}>Recent Transactions</h3>
                </div>
                <div className='stonkCardBody'>
                    <Table
                        columns={columns}
                        dataSource={this.state.data}
                        loading={this.state.loading}
                        rowClassName='recentTransaction'
                        size='small'
                        pagination={false}
                        scroll={{y:450}}
                    />
                </div>
            </div>
        );
    }
}