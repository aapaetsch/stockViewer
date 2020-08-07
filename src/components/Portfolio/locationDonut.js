import React, { Component } from 'react';
import { Donut } from '@ant-design/charts';
import {Card, Row, Col, Skeleton} from "antd";

export default class LocationDonut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formattedData: [],
            originalData: [],
            currentData: []
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
                        locationWeightsOriginal[positions.location] = {'Weight': Number(positions.originalPercent), 'Location': positions.location};
                        locationWeightsCurrent[positions.location] = {'Weight': Number(positions.portfolioPercent), 'Location': positions.location};
                    }
                });

                Object.keys(locationWeightsOriginal).forEach( (key, index) => {
                    dataOriginal.push(locationWeightsOriginal[key]);
                    dataCurrent.push(locationWeightsCurrent[key]);
                });
            }
        console.log(dataCurrent)
        this.setState({originalData: dataOriginal, currentData: dataCurrent, formattedData: dataCurrent});
    }

    render(){
        const data = this.state.formattedData;
        const locationDonut = {
            forceFit: true,
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
            padding: 'auto',
            angleField: 'Weight',
            colorField: 'Location',
            statistic: {visible: false},
        }
        return (
            <Card title='Location Breakdown'>
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