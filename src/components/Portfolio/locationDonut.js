import React, { Component } from 'react';
import { Donut } from '@ant-design/charts';
import {Card, Row, Col, Skeleton} from "antd";
import '../../App.css';

export default class LocationDonut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formattedData: [],
            originalData: [],
            currentData: [],
            updating: false,
        }
    }
    componentDidMount(){
        this.formatData();
    }
    shouldComponentUpdate(nextProps, nextState){
        return this.prop !== nextProps || this.state !== nextState;
    }
    componentDidUpdate(prevProps){
        if (this.props !== prevProps){
            this.formatData();
        }
    }

    formatData = () => {
        if (this.state.updating === false){
            this.setState({updating: true}, () => {

                let dataOriginal = [];
                let dataCurrent = [];
                let locationWeightsOriginal = {};
                let locationWeightsCurrent = {};

                if (this.props.data.length !== 0){
                    console.log(this.props.data)
                    this.props.data.forEach( (positions) => {
                        console.log(positions)
                        try {
                            locationWeightsOriginal[positions.location].Weight += Number(positions.originalPercent);
                            locationWeightsCurrent[positions.location].Weight += Number(positions.portfolioPercent);
                        } catch {
                            locationWeightsOriginal[positions.location] = {'Weight': Number(positions.originalPercent), 'exchange': positions.exchange};
                            locationWeightsCurrent[positions.location] = {'Weight': Number(positions.portfolioPercent), 'exchange': positions.exchange};
                        }
                    });

                    Object.keys(locationWeightsOriginal).forEach( (key, index) => {
                        dataOriginal.push({'Weight': locationWeightsOriginal[key].Weight.toFixed(2), 'exchange': locationWeightsOriginal[key].exchange});
                        dataCurrent.push({'Weight': locationWeightsCurrent[key].Weight.toFixed(2), 'exchange': locationWeightsCurrent[key].exchange});
                    });
                }
                console.log(dataCurrent)
                this.setState({originalData: dataOriginal, currentData: dataCurrent, formattedData: dataCurrent, updating: false});
            });
        }
    }

    render(){
        const data = this.state.formattedData;
        const locationDonut = {
            // forceFit: true,
            title: {
                visible: false,
                text: "Location Breakdown"
            },
            description:{
                visible: false,
                text: 'some description'
            },
            radius: 1,
            data,
            // padding: 'auto',
            angleField: 'Weight',
            colorField: 'exchange',
            statistic: {visible: false},
        }
        return (
            <Card title='Location Breakdown' className='cardRounded'>
                <Row justify='center'>
                    <Col span={24}>
                        { this.state.formattedData.length !== 0 ?
                            (<Donut {...locationDonut}/>)
                            :(<Skeleton active/>)}
                    </Col>
                    <Col span={24}>
                        ...largest location, smallest location
                    </Col>
                </Row>
            </Card>
        );
    }
}