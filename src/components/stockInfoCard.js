import React, {Component} from 'react';
import { Card, Button, Statistic, Row, Col} from "antd";
import 'antd/dist/antd.css';

export default class WorldStatInfoCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card title={this.props.title}>
                <Statistic
                    value={this.props.value}
                    precision={2}
                    />
                <Statistic
                    value={}
                    precision={4}
                    prefix={}
                    suffix={}
                />
            </Card>
        );
    }
}