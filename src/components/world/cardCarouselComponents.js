import React, { createRef } from 'react';
import { getCurrencySymbol } from "../../helpers/exchangeFxns";
import {Card, Button, Statistic, Row, Col, Skeleton, Carousel} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import '../../App.css';

export const CardCarousel = props => {

    const myCarousel = createRef();
    const carouselSettings = {
        ref: myCarousel,
        infinite: true,
        speed: 300,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                    swipeToSlide: true,
                    autoplay: true,
                }
            },
            {
                breakpoint: 847,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                    swipeToSlide: true,
                    autoplay: true
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 9999,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3
                }
            }
        ]
    }

    const buttonCol = {
        'xs': 0,
        'sm': 0,
        'md': 1,
    }
    const carouselCol = {
        'xs': 22,
        'sm': 22,
        'md': 22,
    }

    return (
        <Row justify='center' align='middle' style={{paddingTop: '8px'}}>
            <Col {...buttonCol} style={{textAlign: 'right'}}>
                <Button
                    icon={<LeftOutlined/>}
                    type='primary'
                    onClick={() => myCarousel.current.prev()}/>
            </Col>
            <Col {...carouselCol}>
                <Carousel {...carouselSettings}>
                    {props.data.map( (stats) =>
                        <WorldStatInfoCard
                            data={stats}
                            onClick={() => props.onClick(stats)}
                            type={props.type}/> )}
                </Carousel>
            </Col>
            <Col {...buttonCol} style={{textAlign: 'left'}}>
                <Button
                    icon={<RightOutlined/>}
                    type='primary'
                    onClick={() => myCarousel.current.next()}/>
            </Col>
        </Row>
    )
}

const ExchangeStatistic = props => {

    const currencies = props.exchange.split('/');
    const exchange = `${getCurrencySymbol(currencies[0])}1 = ${getCurrencySymbol(currencies[1])}`
    return <Statistic value={props.value} precision={2} prefix={exchange}/>
}

export const WorldStatInfoCard = (props) => {

    const titleSkeleton = <Skeleton.Input active style={{width: 100, textAlign: 'center'}} size='small'/>
    return (
        <Card
            className='cardRounded'
            title={props.data ? props.data.name : titleSkeleton}
            hoverable
            onClick={props.onClick}
            >
            {props.data ?
                (
                    <div>
                        {props.type === 'exchange' ?
                            (<ExchangeStatistic value={props.data.value} exchange={props.data.name}/>):
                            (<Statistic value={props.data.value} precision={2} prefix={getCurrencySymbol(props.data.currency)}/>)
                        }

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
                            Last Updated: {formatDate(props.data.lastUpdate)}
                        </span>
                    </div>
                ) :
                (<Skeleton active/>)
            }
        </Card>
    )
}

function formatDate(timeStamp) {
    const d = new Date(timeStamp * 1000);
    return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US")}`
}