import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import { Skeleton, Space, Button, Checkbox, DatePicker, message } from 'antd';
import {getHistoricalData} from "../helpers/APICommunication";

const {RangePicker} = DatePicker;


export default class HistoricalChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            dateRange: 14,
        }
    }

    componentDidMount() {
        this.getChartData(this.props.ticker, 5)
    }

    getChartData = (ticker, maxRequests) => {
        getHistoricalData(ticker)
            .then( (res) => {
                if (res){
                    for (let i = 0; i < res.length; i++){
                        res[i].Open = Number(res[i].Open).toFixed(2);
                        res[i].Close = Number(res[i].Close).toFixed(2);
                        res[i].High = Number(res[i].High).toFixed(2);
                        res[i].Low = Number(res[i].Low).toFixed(2);
                    }
                    this.setState({originalData: [...res], isLoading: false}, () => {
                        this.sortData();
                    });
                } else {
                    if (maxRequests === 0){
                        message.error("Error: Could not retrieve historical data")
                    } else {
                        setTimeout(() => this.getChartData(this.props.ticker, maxRequests  - 1), 5000);
                    }
                }
            })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.data !== nextState.data
            || this.state !== nextState;
    }

    decideChecked = (date) => {
        return date === this.state.dateRange;
    }

    setRange = (date) => {
        this.setState({dateRange: date, isLoading: false}, () => {
            this.sortData();
            console.log(date)
        });
    }

    changeRange = (dates, dateStrings) => {
        console.log(dateStrings);
    }


    sortData = () => {

        const currentDate = [...this.state.originalData];
        const day = 8.64e+7
        const now = (Date.now());
        const range = (this.state.dateRange * day)
        let newData = [];
        console.log('Range:', this.state.dateRange,
            '\nStart:',new Date(now - range),
            '\nEnd:', new Date(now),
            '\nCurrentFirst:', new Date(currentDate[0].Date * 1000)
            )



        for (let i = 0; i < currentDate.length; i++){
            const infoDate = currentDate[i].Date * 1000;

            if (infoDate >= (now - range) && infoDate <= now){
                let newDay = {...currentDate[i]};
                newDay.Date = infoDate;
                newData.push(newDay);
            }
        }

        newData.sort((a,b) => {
            return a.Close - b.Close
        } );
        console.log(currentDate, newData)
        this.setState({data: newData});
    }


    render(){
        const data = this.state.data;
        const config = {
            title: {
                visible: false,
                text: 'Historical Data'
            },
            forceFit: true,
            data: data,
            padding: 'auto',
            xField: 'Date',
            yField: 'Close',
            xAxis: {
                type: 'time',
                tickCount: 14
            },
            yAxis: {
                tickCount: 15
            },
            tooltip:{
                fields: ['Close', 'Open', 'High', 'Low', 'Volume']
            },

        }

        return (
            <Skeleton loading={this.state.isLoading} active={true}>
                <Space>
                    {/*<RangePicker*/}
                    {/*    size='small'*/}
                    {/*    onChange={this.changeRange}*/}
                    {/*/>*/}
                    <Checkbox
                        checked={this.decideChecked(14)}
                        onClick={() => this.setRange(14)}
                    >
                        <span style={{color: '#fff'}}>14D</span>
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(31)}
                        onClick={() => this.setRange(31)}
                    >
                        <span style={{color: '#fff'}}>1M</span>
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(90)}
                        onClick={() => this.setRange(90)}
                    >
                        <span style={{color: '#fff'}}>3M</span>
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(180)}
                        onClick={() => this.setRange(180)}
                    >
                        <span style={{color: '#fff'}}>6M</span>
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(365)}
                        onClick={() => this.setRange(365)}
                    >
                        <span style={{color: '#fff'}}>1Y</span>
                    </Checkbox>

                </Space>

                <Line {...config}/>
            </Skeleton>
        );
    }


}