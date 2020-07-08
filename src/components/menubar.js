import React, { Component } from 'react';
import {Menu, Button, Row, Col} from 'antd';
import '../styles/stocklist.css';
import 'antd/dist/antd.css';
import { auth } from 'firebase';
export default class MenuBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: null,
        }
    }




    render () {
        return(
          <Row justify='end' align='middle' gutter={[5,5]}>
              <Col span={2}/>
              <Col span={2}>
                  <h2>
                      Stonks
                  </h2>
              </Col>
              <Col span={14}/>
              <Col className='gutter-row' span={2}>
                  <Button type='primary'>
                      Login
                  </Button>
              </Col>
              <Col className='gutter-row' span={2}>
                  <Button type='primary'>
                      Sign Up
                  </Button>
              </Col>
              <Col span={2}/>
          </Row>
        );
    }
}