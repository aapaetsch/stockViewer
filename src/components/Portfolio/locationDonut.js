import React, { Component } from 'react';
import { Donut } from '@ant-design/charts';
import {Card, Row, Col, Skeleton} from "antd";

export default class LocationDonut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formattedData: []
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
        let data = [];
        let locationWeights = {};

        if (this.props.data.length !== 0){

                Object.keys(this.props.exchangeLocation).forEach ((key, index) =>{
                    console.log(key);
                    locationWeights[key] = {Weight: 0, 'Location': this.props.exchangeLocation[key]}
                });
                this.props.data.forEach( (position) => {
                    console.log(locationWeights);
                    locationWeights[position.exchange].Weight += 1;
                });
                Object.keys(this.props.exchangeLocation).forEach( (key, index) => {
                    data.push(locationWeights[key]);
                });
            }
        this.setState({formattedData: data});
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