import React, {Component} from 'react';
import { Card, Button, Statistic, Row, Col, Skeleton } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
// import 'antd/dist/antd.css';
import '../../App.css';

export const WorldStatInfoCard = props => {
    return (
        <Card
            title={props.data ? (props.data.name) : (<Skeleton.Input active style={{width: 100, textAlign: 'center'}} size='small'/>)}
            className='cardRounded'
            hoverable
            >
            {props.data ?
                (
                    <div>
                        <Statistic
                            value={props.data.value}
                            precision={2}
                        />
                        <Statistic
                            value={props.data.change}
                            valueStyle={props.data.change > 0 ?
                                ({color: '#49aa19'}) :
                                ({color: '#d32029'})
                            }
                            prefix={props.data.change > 0 ?
                                (<ArrowUpOutlined/>) :
                                (<ArrowDownOutlined/>)
                            }
                            suffix={` (${props.data.changePercent})`}
                        />
                        <span className='lastUpdateText'>
                        Last updated: {formatDate(props.data.lastUpdate)}
                        </span>
                    </div>
                ) : (
                    <Skeleton  active/>
                )
            }
        </Card>
    )
}

function formatDate(timeStamp) {
    const d = new Date(timeStamp * 1000);
    return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US")}`
}