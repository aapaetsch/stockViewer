import React, {Component} from 'react';
import { Card, Button, Row, Col, Statistic, Modal, Table, Descriptions, Space, Tabs} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {auth, realTime} from '../services/firebase'
// import 'antd/dist/antd.css';
import '../App.css';
import RecentTransactionCard from "../components/Portfolio/recentTransactionCard";
import HistoricalChart from "../components/historicalChart";
import AddStock from "./addStock";
import {formatDate} from "../components/world/cardCarouselComponents";
import {getSingleTicker} from "../helpers/APICommunication";

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
        return this.props !== nextProps || this.state !== nextState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props);
        if (this.props.visible === false){
            if (this.state.owned){
                this.endPositionListener();
            }
        } else if (this.props.visible && this.props.data !== prevProps.data){
            getSingleTicker('current', 'ticker', this.props.data.ticker).then((response) => {
                if (response !== null){
                    this.setState({liveData: response});
                }
            });
            this.setPositionListener();
        }
    }

    validateOwnership = async (connectionString) => {
        return await realTime.ref(connectionString).once('value', (response) => {
            return response;
        });
    }

    setPositionListener = async () => {
        const ticker = this.props.data.ticker.replace('.', '_');
        const connectionString = `/portfolios/${auth().currentUser.uid}/${ticker}`
        const owned = await this.validateOwnership(connectionString);

        if (owned){
            this.setState({owned: true})
            this.positionListener = await realTime.ref(connectionString).on('value', (position) => {
                this.formatData(position);
            })
        }
    }

    endPositionListener = () => {
        this.setState({owned: false, positionData: {}})
        this.positionListener.off()
    }

    formatData = (position) => {
        const myPosition = position.val();
        console.log(myPosition)
        const positionData = {
            bookvalue: myPosition.cost,
            category: myPosition.category,
            shares: myPosition.shares,
            transactions: myPosition.transactions,
            profitPercent: this.props.data.profitPercent,
        }
        this.setState({positionData: positionData});
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
                    <span className='lastUpdateText'>
                        Last Updated: {formatDate(this.state.liveData.lastUpdate)}
                    </span>
                    <Button
                        style={{alignSelf: 'end'}}
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
                        <h2 style={{alignSelf: 'center'}}>{this.state.liveData.title}</h2>
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
                <LiveDescription
                    data={this.state.liveData}
                />
                <Tabs
                    defaultActiveKey='chart'
                    size='small'
                >
                    <TabPane tab='Historical Chart' key='chart'>
                        <HistoricalChart
                            ticker={this.props.data.ticker}
                        />
                    </TabPane>
                    {this.state.owned &&
                        <TabPane tab='My Position' key='position'>
                            <RecentTransactionCard
                                singleStock={true}
                                currency={this.props.data.currency}
                                data={[this.state.positionData.transactions]}
                                />
                        </TabPane>
                    }
                </Tabs>
            </Modal>
        );
    }
}

const LiveDescription = props => {
    return (
        <Row justify='left' align='middle' style={{color: '#000'}}>
            <Col>
                <span>
                    {props.data.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
            </Col>
            <Col>
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
            <Col>
                <span>Exchange: {props.data.exchange}</span>
            </Col>
        </Row>
    )
}

const PositionDescription = props => {
    return (
        <Descriptions>
            <Descriptions.Item label='Book Value'>

            </Descriptions.Item>
            <Descriptions.Item label='Current Value'>

            </Descriptions.Item>
            <Descriptions.Item label='Profit %'>

            </Descriptions.Item>
            <Descriptions.Item label='Day Change'>

            </Descriptions.Item>
            <Descriptions.Item label='Shares'>

            </Descriptions.Item>
            <Descriptions.Item label='Avg Price Per Share'>

            </Descriptions.Item>
        </Descriptions>
    )
}
