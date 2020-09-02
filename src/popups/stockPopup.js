import React, {Component} from 'react';
import { Card, Button, Row, Col, Statistic, Modal, Table, Descriptions, Space, Tabs} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import { auth } from '../services/firebase'
// import 'antd/dist/antd.css';
import '../App.css';
import RecentTransactionCard from "../components/Portfolio/recentTransactionCard";
import HistoricalChart from "../components/historicalChart";
import AddStock from "./addStock";

const { TabPane } = Tabs;

export default class StockDataDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps;
    }


    render() {
        const titleCols = {
            'xs': 13,
            'sm': 13,
            'md': 15
        }
        const buttonCols = {
            'xs': 6,
            'sm': 6,
            'md': 4
        }

        const modalConfig = {
            width: '80%',
            height: '100%',
            closable: false,
            maskClosable: true,
            footer: [
                <div style={{textAlign: 'right'}}>
                    <Button
                        type='primary'
                        onClick={this.props.close}
                    >
                        Close
                    </Button>
                </div>
                ]
        }

        return (
            <Modal
                {...modalConfig}
                visible={this.props.visible}
                onCancel={this.props.close}
                bodyStyle={{background: 'white'}}
                title={
                    <Row justify='center' align='middle' style={{height: '100%', width: '100%', background: 'white'}}>
                        <Col {...buttonCols} />
                        <Col {...titleCols}>
                            <h2 style={{alignSelf: 'center', color: '#fff'}}>{this.props.data.title}</h2>
                        </Col>
                        <Col {...buttonCols}>
                            <Space>
                                {auth().currentUser !== null &&
                                <AddStock
                                    icon={null}
                                    buttonText='Buy'
                                    initial={{
                                        costType: 'perShare',
                                        ticker: this.props.data.ticker,
                                    }}/>
                                }
                                {this.props.owned &&
                                (<Button disabled={true}>
                                    Sell
                                </Button>)
                                }
                            </Space>
                        </Col>
                    </Row>
                }
            >
                <Tabs
                    defaultActiveKey='values'
                    size='small'
                >
                    <TabPane tab='Current Values' key='values'>

                    </TabPane>
                    <TabPane tab='Historical Chart' key='chart'>

                    </TabPane>

                </Tabs>




                <Row>
                    <Col span={24}>
                        <Descriptions>
                            <Descriptions.Item label='Current Price'>
                                <span>{this.props.owned ? (this.props.data.current) : (this.props.data.price)}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label='Change'>
                                <Statistic
                                    value={this.props.data.change}
                                    precision={2}
                                    valueStyle={this.props.data.change >= 0 ?
                                        ({color: '#3f8600'}) :
                                        ({color: '#cf1322'})
                                    }
                                    prefix={this.props.data.change >= 0 ?
                                        (<ArrowUpOutlined/>) :
                                        (<ArrowDownOutlined/>)
                                    }
                                    suffix={`(${this.props.data.changePercent}%)`}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>


                <Row justify='center'>
                    <Col span={5}>
                        <StockData {...this.props}/>
                    </Col>
                    <Col span={14}>
                        <HistoricalChart
                            ticker={this.props.data.ticker}
                        />
                    </Col>
                    <Col span={4}>
                    {this.props.owned &&
                        (<RecentTransactionCard
                                data={[this.props.data]}
                                singleStock={true}
                                currency={this.props.data.currency}/>
                        )
                    }
                    </Col>
                </Row>
            </Modal>
        );
    }
}

const StockData = props => {
    return (
        <table>
            <tbody>
            <tr>
                <td>
                    <h3>Current Price:</h3>
                </td>
                <td>
                    <span>{props.owned ? (props.data.current) : (props.data.price)}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>Change:</h3>
                </td>
                <td>
                    <Statistic
                        value={props.data.change}
                        precision={2}
                        valueStyle={props.data.change >= 0 ?
                            ({color: '#3f8600'}) :
                            ({color: '#cf1322'})
                        }
                        prefix={props.data.change >= 0 ?
                            (<ArrowUpOutlined/>) :
                            (<ArrowDownOutlined/>)
                        }
                        suffix={`(${props.data.changePercent})`}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <h3>Currency:</h3>
                </td>
                <td>
                    {props.data.currency}
                </td>
            </tr>
            <tr>
                <td>
                    <h3>Exchange:</h3>
                </td>
                <td>
                    <span>
                        {props.data.exchange}
                    </span>
                </td>
            </tr>
            <tr>

            </tr>
            </tbody>
        </table>
    )
}