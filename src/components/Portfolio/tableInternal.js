import React, {Component} from 'react';
import { Card, Button, Row, Col, Statistic} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons'
// import 'antd/dist/antd.css';
import '../../App.css';

export default class TableInternal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card
                title={this.props.data.title}
                headStyle={{backgroundColor:'#d9d9d9',color: '#000000', borderRadius: 0}}
                bodyStyle={{borderRadius: 0}}
                bordered={false}
            >
                <Row>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>
                        <Statistic
                            value={this.props.data.changePercent}
                            precision={2}
                            valueStyle={this.props.data.changePercent >= 0 ?
                                ({color: '#3f8600'}) :
                                ({color: '#cf1322'})
                            }
                            prefix={this.props.data.changePercent >= 0 ?
                                (<ArrowUpOutlined/>):
                                (<ArrowDownOutlined/>)
                            }
                            suffix="%"
                            />
                    </Col>
                </Row>
            </Card>
        );
    }
}