import React, { Component } from 'react';
import {Table} from 'antd';
import 'antd/dist/antd.css';
import '../styles/portfolio.css'
import '../App.css'


export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{a:0, b:69}],
            switch: false
        }
        this.data = [];
        this.i = 0
    }


    render(){
        const col = [{
            title: 'a', dataIndex: 'a'
        }, {title: 'b', dataIndex: 'b'}];
        return(
            <div className='portfolioBackground'>
                <p>
                Hello World
                </p>
                <Table
                    columns={col}
                    dataSource={this.state.data}/>


            </div>
        );
    }
}