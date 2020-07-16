import React, { Component } from 'react';
import { Radar } from '@ant-design/charts';
import {Card, Col, Row, Skeleton} from 'antd';


export default class CategoryRadar extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            formattedData: [],
            marketSectors: ['Technology', 'Communication', 'Consumer Discretionary', 'Consumer Staple',
                'Energy', 'Financial', 'Healthcare', 'Industrial', 'Materials', 'Real Estate', 'Utilities',
                'International', 'Misc']
        }
        this.formatData = this.formatData.bind(this);
    }

    componentDidMount() {
        this.setState({data: this.props.data}, () => this.formatData());
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.data !== nextProps.data;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('update', prevProps, this.props);
        this.setState({data: this.props.data}, () => this.formatData());
    }

    async formatData() {
        let currentWeight = {};
        let originalWeight = {};
        let radarData = [];
        if (this.props.data.length !== 0) {
            console.log(this.props.data);
            this.state.marketSectors.forEach( (sector) => {
                currentWeight[sector] = { Weight: 10};
                originalWeight[sector] = { Weight: 10};
            });
            this.props.data.forEach((position) => {
                console.log(currentWeight[position.category]['Weight']);
                // currentWeight[position.category]['Weight'] = position.portfolioPercent + currentWeight[position.category].Weight;
                // originalWeight[position.category].Weight += position.originalPercent;
            });
            this.state.marketSectors.forEach( (sector) => {
                radarData.push({'Market Sector': sector, Weight: currentWeight.Weight, Type: 'Current Weight'},
                    {'Market Sector': sector, Weight: originalWeight.Weight, Type: 'Original Weight'});
            });
        }
        this.setState({formattedData: radarData}, () => console.log(this.state.formattedData, this.state.data));
    }

    render() {
        const categoryPlot = {
            title:{
                visible: false,
                text: 'Market Sector Radar'
            },
            angleField: 'Market Sector',
            radiusField: 'Weight',
            seriesField: 'Type',
            radiusAxis: { grid: {line: {type: 'line'} } },
            line: { visible: true},
            point: {
                visible: true,
                shape: 'circle'
            },
            legend: {
                visible: true,
                position: 'bottom-center',
            }
        };
        return (
            <Card title='Market Sector Weight'>
                <Row justify='center'>
                    <Col span={24}>
                        {this.state.formattedData.length !== 0 ?
                            (<Radar {...categoryPlot} data={this.state.formattedData}/>)
                            :(<Skeleton active/>)
                        }
                    </Col>
                </Row>
                <Row justify='center' align='middle'>
                    <Col span={24}>
                        ... heaviest Industry, lightest industry
                    </Col>
                </Row>
            </Card>
        );
    }
}