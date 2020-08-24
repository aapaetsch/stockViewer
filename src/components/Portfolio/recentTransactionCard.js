import React, {Component} from 'react';
import {Table, DatePicker, Space, Button } from 'antd';
import {getConversionRatio, getCurrencySymbol} from "../../helpers/exchangeFxns";
import { getAllOf } from "../../helpers/APICommunication";
import { SearchOutlined } from '@ant-design/icons';
import '../../App.css';
const { RangePicker } = DatePicker;

export default class RecentTransactionTable extends Component {
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

    valueAdjustCurrency = async (data) => {

        const currencyData = await getAllOf('currencies', 'object');
        if (currencyData){

            for (let i = 0; i < data.length; i++){

                if (data[i].currency !== 'USD'){
                    const ratio = getConversionRatio(currencyData, data[i].currency, 'USD')

                    if (ratio !== null){
                        data[i].value = data[i].value * ratio;
                    }
                }
            }
        }
        return data
    }

    sortData = () => {
        if (this.state.loading === false && this.props.data.length !== 0){
            this.setState({loading: true}, async () => {
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


                            data.push({
                                ticker: this.props.data[i].ticker,
                                key: i.toString() + j.toString(),
                                date: d,
                                action: t,
                                value: value,
                                type: type,
                                currency: this.props.data[i].currency,
                            });
                        }

                    }
                    data = await this.valueAdjustCurrency(data);

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

    disabledDates = (type, current) => {
        console.log(current);
        if (type === 'start'){
            return current && current > this.state.end;
        } else {
            return current && current < this.state.start
        }
    }

    changeStartDate = (date, dateString) => {
        this.setState({start: new Date(date + ' 00:00:00')});
    }

    disableStartDate = (current) => {
        if (this.state.end !== null){
            return current && current > this.state.end;
        }
    }

    changeEndDate = (date, dateString) => {
        this.setState({end: new Date(date + ' 23:59:59')});
    }

    disableEndDate = (current) => {
        return current && current < this.state.start;
    }



    render(){

        let columns = [
            {
                title: 'Date', dataIndex: 'date',
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

        if (this.props.singleStock){
            columns.splice(2,1)
        }

        return (
            <Table
                columns={columns}
                dataSource={this.state.data}
                loading={this.state.loading}
                rowClassName='recentTransaction'
                size='small'
                pagination={false}
                scroll={{y:450}}
            />
        );
    }
}