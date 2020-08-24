import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import { Skeleton, Space, Button, Checkbox, DatePicker } from 'antd';
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
                    setTimeout(() => this.getChartData(ticker, maxRequests), 5000);
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
        });

    }

    sortData = () => {

        const currentDate = [...this.state.originalData];
        const day = 8.64e+7
        const now = (Date.now())/1000;
        const range = (this.state.dateRange * day)/1000
        let newData = [];

        for (let i = 0; i < currentDate.length; i++){
            if (currentDate[i].Date >= (now - range) && currentDate[i].Date <= now){
                currentDate[i].Date = new Date(currentDate[i].Date * 1000);
                newData.push({...currentDate[i]});
            }
        }

        newData.sort((a,b) => {
            return a.Close - b.Close
        } );

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
            }
        }

        return (
            <Skeleton loading={this.state.isLoading} active={true}>
                <Space>
                    <Checkbox
                        checked={this.decideChecked(14)}
                        onClick={() => this.setRange(14)}
                    >
                        14D
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(31)}
                        onClick={() => this.setRange(31)}
                    >
                        1M
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(90)}
                        onClick={() => this.setRange(90)}
                    >
                        3M
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(180)}
                        onClick={() => this.setRange(180)}
                    >
                        6M
                    </Checkbox>
                    <Checkbox
                        checked={this.decideChecked(365)}
                        onClick={() => this.setRange(365)}
                    >
                        1Y
                    </Checkbox>
                    {/*<RangePicker/>*/}
                </Space>

                <Line {...config}/>
            </Skeleton>
        );
    }


}