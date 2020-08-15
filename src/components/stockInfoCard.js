import React, {Component} from 'react';
import { Card, Button, Statistic, Row, Col} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import '../styles/cards.css';

export default class WorldStatInfoCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        function formatDate(timeStamp) {
            const d = new Date(timeStamp * 1000);
            return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US")}`
        }
        return (
            <Card title={this.props.data.name} className='cardRounded' hoverable>
                <Statistic
                    value={this.props.data.value}
                    precision={2}
                    />
                <Statistic
                    value={this.props.data.change}
                    valueStyle={this.props.data.change > 0 ?
                        ({color: '#3f8600'}) :
                        ({color: '#cf1322'})
                    }
                    prefix={this.props.data.change > 0 ?
                        (<ArrowUpOutlined/>):
                        (<ArrowDownOutlined/>)
                    }
                    suffix={` (${this.props.data.changePercent})`}
                />
                <span style={{color: '#bfbfbf', fontSize: '10px', paddingTop: '3%'}}>
                    Last updated: {formatDate(this.props.data.lastUpdate)}
                </span>
            </Card>
        );
    }
}