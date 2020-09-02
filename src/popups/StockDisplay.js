import React, {Component} from 'react';
import { Card, Button, Row, Skeleton, Col, Statistic, Modal, Table, Descriptions, Space, Tabs} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {auth, realTime} from '../services/firebase'
// import 'antd/dist/antd.css';
import '../App.css';
import RecentTransactionCard from "../components/Portfolio/recentTransactionCard";
import HistoricalChart from "../components/historicalChart";
import AddStock from "./addStock";
import {formatDate} from "../components/world/cardCarouselComponents";
import {checkTickerExists} from "../helpers/APICommunication";
import {getCurrencySymbol, addCommas, colorSwitcher} from "../helpers/exchangeFxns";

const { TabPane } = Tabs;

export default class StockDataDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owned: false,
            positionData: {},
            liveData: {},
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps
            || this.state.liveData !== nextState.liveData
            || this.state.positionData !== nextState.positionData;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props);
        if (this.props.visible === false){
            if (this.state.owned){
                this.endPositionListener();
            }
        } else if (this.props.data.ticker !== prevProps.data.ticker &&this.props.visible && this.props.data !== prevProps.data){
            checkTickerExists(this.props.data.ticker).then((response) => {
                if (response !== null){
                    this.setPositionListener(response);
                }
            });

        }
    }

    validateOwnership = async (connectionString) => {
        return await realTime.ref(connectionString).once('value', (response) => {
            return response;
        });
    }

    setPositionListener = async (liveData) => {
        const ticker = this.props.data.ticker.replace('.', '_');
        if (auth().currentUser !== null){
            const connectionString = `/portfolios/${auth().currentUser.uid}/${ticker}`
            const owned = await this.validateOwnership(connectionString);
            if (owned.val() !== null){
                this.setState({owned: true})
                this.positionListener = realTime.ref(connectionString);
                this.positionListener.on('value', (position) => {
                    let positionData = this.formatData(position);
                    positionData['currentvalue'] = liveData.price * positionData.shares;
                    this.setState({liveData: liveData, positionData: positionData});
                })
            } else {
                this.setState({liveData: liveData});
            }
        }  else {
            this.setState({liveData: liveData});
        }

    }

    endPositionListener = () => {
        this.setState({owned: false, positionData: {}});
        this.positionListener.off();
    }

    formatData = (position) => {
        const myPosition = position.val();
        let sinceOldest = 99999999999999999999;
        Object.keys(myPosition.transactions).forEach( (transaction) => {
            const date = new Date(myPosition.transactions[transaction].date);
            console.log(date)
            if (date < sinceOldest){
                sinceOldest = date;
            }
        } )

        const positionData = {
            bookvalue: myPosition.cost,
            category: myPosition.category,
            shares: myPosition.shares,
            currency: this.props.data.currency,
            transactions: [{transactions: myPosition.transactions}],
            profitPercent: this.props.data.profitPercent,
            dayChange: this.props.data.change * myPosition.shares,
            purchaseLength: sinceOldest,
        }
        return positionData;
    }

    render() {
        console.log(this.state.positionData)
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

        const footerStyle = {
            alignSelf: 'center',
            textAlign: 'right',
            height: 'parent',
            width: 'parent',
            padding: '10px 16px',
            margin: '-10px -16px',
            backgroundColor: '#f0f0f0',
        }

        const modalConfig = {
            width: '80%',
            height: '100%',
            closable: false,
            maskClosable: true,
            footer: [
                <div style={{...footerStyle}}>
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
                bodyStyle={{backgroundColor: '#f0f0f0'}}
            >
                <Row justify='center' align='middle' style={{textAlign: 'center'}}>
                    <Col {...buttonCols} />
                    <Col {...titleCols}>
                        <h2 style={{alignSelf: 'center', marginBottom: '-5px'}}>{this.state.liveData.title}</h2>
                        <span className='lastUpdateText' style={{alignSelf: 'left'}}>
                        Last Live Update: {formatDate(this.state.liveData.lastUpdate)}
                    </span>
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
                            {this.state.owned &&
                            (<Button disabled={true}>
                                Sell
                            </Button>)
                            }
                        </Space>
                    </Col>
                </Row>
                {/*{this.state.liveData !== {} ?*/}
                {/*    (<StockDescription data={this.state.liveData}/>) :*/}
                {/*    (<Skeleton active/>)*/}
                {/*}*/}
                <Tabs
                    defaultActiveKey='chart'
                    size='small'
                    >
                    <TabPane tab='Historical Chart' key='chart'>
                        <HistoricalChart
                            ticker={this.props.data.ticker}
                            purchaseRange={this.state.positionData.purchaseLength}
                            />
                    </TabPane>
                    {this.state.owned &&
                        <TabPane tab='My Position' key='position'>
                            <PositionDescription
                                data={this.state.positionData}
                            />
                            <RecentTransactionCard
                                singleStock={true}
                                currency={this.props.data.currency}
                                data={this.state.positionData.transactions}
                            />
                        </TabPane>

                    }
                </Tabs>
            </Modal>
        );
    }
}

const StockDescription = props => {
    return (
        <Row justify='left' align='middle'>
            <Col span={7}>
                <h2>{`${getCurrencySymbol(props.data.currency)} ${props.data.price}`}</h2>
                <span style={{color:'#595959'}}>Currency in {props.data.currency}</span>
            </Col>
            <Col span={7}>
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
                    suffix={`(${props.data.changePercent}%)`}
                />
            </Col>
            <Col span={7}>
                <h3>Exchange: <span>{props.data.exchange}</span></h3>
            </Col>
        </Row>
    )
}

const PositionDescription = props => {
    return (
        <Descriptions>
            <Descriptions.Item label='Book Value'>
                <span>{getCurrencySymbol(props.data.currency)} {addCommas(props.data.bookvalue)}</span>
            </Descriptions.Item>
            <Descriptions.Item label='Current Value'>
                {`${getCurrencySymbol(props.data.currency)} ${addCommas(props.data.currentvalue)}`}
            </Descriptions.Item>
            <Descriptions.Item label='Profit'>
                <span className={colorSwitcher(props.data.profitPercent)}>{props.data.profitPercent}%</span>
            </Descriptions.Item>
            <Descriptions.Item label='Day Change'>
                {`${getCurrencySymbol(props.data.currency)} ${addCommas(props.data.dayChange)}`}
            </Descriptions.Item>
            <Descriptions.Item label='Shares'>
                {props.data.shares}
            </Descriptions.Item>
            <Descriptions.Item label='Original PPS'>
                {`${getCurrencySymbol(props.data.currency)} ${addCommas(props.data.bookvalue / props.data.shares)}`}
            </Descriptions.Item>
        </Descriptions>
    )
}
