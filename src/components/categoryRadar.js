import React, { Component } from 'react';
import { Radar } from '@ant-design/charts';
import {Card, Col, Row} from 'antd';


export default class CategoryRadar extends Component {
    constructor(props){
        super(props);
    }


    render() {
        const data = this.props.data;
        const categoryPlot = {
            title:{
                visible: false,
                text: 'Market Category Radar'
            },
            data,
            angleField: 'category',
            radiusField: 'portfolioPercent',
            seriesField: 'percentType',
            radiusAxis: { grid: {line: {type: 'line'} } },
            line: { visible: true},
            point: {
                visible: true,
                shape: 'circle'
            },
            legend: {
                visible: true,
                position: 'bottom-center',
            }
        };
        return (
            <Card title='Industry Weight'>
                <Row justify='center'>
                    <Col span={24}>
                        <Radar {...categoryPlot}/>
                    </Col>
                </Row>
                <Row justify='center' align='middle'>
                    <Col span={24}>
                        ... heaviest Industry, lightest industry
                    </Col>
                </Row>
            </Card>
        );
    }
}