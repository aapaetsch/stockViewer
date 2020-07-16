import React, { Component } from 'react';
import { Donut } from '@ant-design/charts';
import {Card, Row, Col} from "antd";

export default class LocationDonut extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const data = this.props.data;
        const locationDonut = {
            forceFit: true,
            title: {
                visible: false,
                text: "Location Breakdown"
            },
            description:{
                visible: true,
                text: 'some description'
            },
            radius: 1,
            padding: 'auto',
            data,
            angleField: 'value',
            colorField: 'type',
        }
        return (
            <Card title='Location Breakdown'>
                <Row justify='center'>
                    <Col span={24}>
                        <Donut {...locationDonut}/>


                    </Col>
                    <Col span={24}>
                        ...largest location, smallest location
                    </Col>
                </Row>
            </Card>
        );
    }
}