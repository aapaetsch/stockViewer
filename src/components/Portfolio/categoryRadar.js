import React, { Component } from 'react';
import { Radar } from '@ant-design/charts';
import {Card, Col, Row, Skeleton} from 'antd';
import '../../styles/cards.css';


export default class CategoryRadar extends Component {
    constructor(props){
        super(props);
        this.state = {
            formattedData: [],
            marketSectors: ['Technology', 'Communication', 'Energy', 'Financial',
                'Healthcare','Industrial', 'Consumer Staple','Consumer Discretionary',
                'International','Misc', 'Utilities', 'Materials',  'Real Estate'],
        }
    }
    componentDidMount(){
        this.formatData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    }

    componentDidUpdate(prevProps) {
        console.log('update', prevProps, this.props);
        if (this.props !== prevProps){
            this.formatData();
        }

    }


    formatData = () => {
        let currentWeight = {};
        let originalWeight = {};
        let radarData = [];
        let missingSectors = [];
        let smallestSector = null;
        let largestSector = null;
        if (this.props.data.length !== 0) {

            this.props.data.forEach((position) => {
                try {
                    currentWeight[position.category].weight += Number(position.portfolioPercent);
                    originalWeight[position.category].weight += Number(position.originalPercent);

                } catch(error){
                    currentWeight[position.category] = {weight: Number(position.portfolioPercent)};
                    originalWeight[position.category] = {weight : Number(position.originalPercent)};
                }
            });

            this.state.marketSectors.forEach( (sector) => {
                try{
                    radarData.push({'Market Sector': sector, Weight: currentWeight[sector].weight, Type: 'Current'},
                        {'Market Sector': sector, Weight: originalWeight[sector].weight, Type: 'Original'});
                } catch(error){
                    console.log(error);
                }


            });


        }
        this.setState({formattedData: radarData});
    }

    render() {
        const categoryPlot = {
            forceFit: true,
            title:{
                visible: false,
                text: 'Market Sector Radar'
            },
            angleField: 'Market Sector',
            radiusField: 'Weight',
            seriesField: 'Type',
            radiusAxis: { grid: {line: {type: 'line'} } },
            line: { visible: true},
            area: {
                visible: true,
                style: {
                    opacity: 0.25,
                },
            },
            point: {
                visible: true,
                shape: 'circle'
            },
            legend: {
                visible: true,
                position: 'bottom-center',
            },
        };
        return (
            <Card title='Market Sector Weights' className='cardRounded'>
                <Row justify='center' align='middle'>
                    <Col span={24}>
                        {this.state.formattedData.length !== 0 ?
                            (<Radar {...categoryPlot} data={this.state.formattedData}/>) :
                            (<Skeleton active/>)
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        ...heaviest industyr, lightest industyr, original heavy, original light
                    </Col>
                </Row>
            </Card>

        );
    }
}