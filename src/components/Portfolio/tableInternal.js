import React, {Component} from 'react';
import { Card, Button, Row, Col, Statistic, Modal, Table, Descriptions, Space} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import { auth } from '../../services/firebase'
// import 'antd/dist/antd.css';
import '../../App.css';
import RecentTransactionCard from "./recentTransactionCard";
import HistoricalChart from "../historicalChart";
import AddStock from "../../popups/addStock";

export default class StockDataDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    //
    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return this.props.visible !== nextProps.visible;
    // }


    render() {

        return (
            <div className='loginCard'>
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
                        <br/>
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
                        <br/><br/>
                    {this.props.owned &&
                        (<RecentTransactionCard
                                data={[this.props.data]}
                                singleStock={true}
                                currency={this.props.data.currency}/>
                        )
                    }
                    </Col>
                </Row>
            </div>
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