import React, {Component} from 'react';
import { Card, Button, Row, Col, Statistic} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons'

export default class TableInternal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card title={this.props.data.title}>
                <Row>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>
                        <Statistic
                            value={this.props.data.dayPercent}
                            precision={2}
                            valueStyle={this.props.data.dayPercent >= 0 ?
                                ({color: '#3f8600'}) :
                                ({color: '#cf1322'})
                            }
                            prefix={this.props.data.dayPercent >= 0 ?
                                (<ArrowUpOutlined/>):
                                (<ArrowDownOutlined/>)
                            }
                            suffix="%"
                            ></Statistic>

                    </Col>
                </Row>
            </Card>
        );
    }
}