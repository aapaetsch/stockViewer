import React, { Component, createRef } from 'react';
import {Modal, Button, Form, Input, Select, notification, Space, Col, Row, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addPosition } from "../helpers/rtdbCommunication";
import '../App.css';

const { Option } = Select;

export default class AddStock extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            costTypeSize: 110,
        }
        this.addStockOk = this.addStockOk.bind(this);
        this.addStockCancel = this.addStockCancel.bind(this);
        this.formRef = createRef();
    }

    async addStockOk(values) {
        console.log(values);
        values.ticker = values.ticker.toUpperCase();
        //check the values to see if they are proper
        if (values.shares.toString().includes('.')){
            message.error('Number of shares must be whole numbers.', 15)
        } else if (isNaN(values.cost)) {
            message.error('Cost must be a number.');
        } else {
            let totalCost;
            if (values.costType === 'perShare'){
                totalCost = Number(values.cost) * Number(values.shares);
            } else {
                totalCost = Number(values.cost);
            }
            message.loading("Add Stock in Progress...", 3);
            await addPosition(values, totalCost)
                .then((success) => {
                    console.log(success);
                    if (success[0]){
                        //todo: fix the alert triggers.
                        if (success[1] === 'add'){
                            notification['success']({
                                message: 'Added Stock Successfully',
                                description: this.notificationContent(values, totalCost)
                            });
                        } else {
                            notification['success']({
                                message: 'Updated Stock Successfully',
                                description: this.updatePositionContent(success[2])
                            });
                        }
                    } else {
                        message.error('There was an error adding the position.')
                    }
                    this.hideAddStock();
                })
        }
    }

    notificationContent = (values, totalCost) =>{
        return (
            <span>
                Ticker: {values.ticker.toUpperCase()}<br/>
                Sector: {values.category}<br/>
                Cost: ${totalCost}
            </span>
        );
    }
    updatePositionContent = (payload) =>{
        return (
          <span>
              Ticker: {payload[0].toUpperCase()}<br/>
              {(payload[3][0] !== payload[3][1]) &&
                (<div>
                    <span>Sector: {payload[3][0]} => {payload[3][1]}</span><br/>
                </div>)
              }
              Shares: {payload[1][0]} => {payload[1][1]}<br/>
              Book Value: ${payload[2]}
          </span>
        );

}

    async addStockCancel() {
        this.hideAddStock();
    }

    showAddStock = () => {
        this.setState({visible: true});
    }

    hideAddStock = () => {
        try{
            this.formRef.current.resetFields();
        } catch(error){
            console.log(error);
        }
        this.setState({visible: false});

    }

    render(){
        const formItemLayout = {
            labelCol: { xs: { span: 12}, sm: { span: 6}},
            wrapperCol: { xs: { span: 28}, sm: { span: 20}},
        };
        const costTypeSelector = (
            <Form.Item name='costType' noStyle>
                <Select
                    style={{width: this.state.costTypeSize}}>
                    <Option value="perShare">Per Share</Option>
                    <Option value="allShares">Total Cost</Option>
                </Select>
            </Form.Item>
        )

        return (
          <div>
              {/*TODO: only enable add if a user is logged in.*/}
              <Button type="primary" icon={<PlusOutlined/>} onClick={this.showAddStock} disabled={this.props.updatingData}/>
              <Modal
                  title="Add A Stock"

                  visible={this.state.visible}
                  maskClosable={false}
                  closable={false}
                  footer={[
                      <span>
                          Ticker should be in form "Ticker.Exchange" i.e. "BAM-A.TO".
                          If you are unsure, please check at <a href='https://ca.finance.yahoo.com'>Yahoo Finance</a>.
                      </span>

                  ]}
                  >
                  <Form
                      {...formItemLayout}
                      layout='horizontal'
                      size='medium'
                      initialValues={{
                          costType: 'perShare',
                      }}
                      ref={this.formRef}
                      onFinish={this.addStockOk}
                  >
                      <Form.Item
                          name='ticker'
                          label='Ticker'
                          rules={[
                              {
                                  required: true,
                                  message: 'Must be a valid ticker.',
                              }
                          ]}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name='category'
                          label='Market Sector'
                          rules={[
                              {
                                  required: true,
                                  message: 'Must belong to a Sector.',
                              }
                          ]}
                      >
                          <Select>
                              <Option value="Technology">Technology</Option>
                              <Option value="Communication">Communication</Option>
                              <Option value="Consumer Discretionary">Consumer Discretionary</Option>
                              <Option value="Consumer Staple">Consumer Staples</Option>
                              <Option value='Energy'>Energy</Option>
                              <Option value="Financial">Financial</Option>
                              <Option value="Healthcare">Healthcare</Option>
                              <Option value="Industrial">Industrial</Option>
                              <Option value="Materials">Materials</Option>
                              <Option value="Real Estate">Real Estate</Option>
                              <Option value="Utilities">Utilities</Option>
                              <Option value="International">International</Option>
                              <Option value="Misc">Misc</Option>
                          </Select>
                      </Form.Item>
                      <Form.Item
                          name='shares'
                          label='Shares'
                          rules={[
                              { required: true, message: 'Must have at least 1 share.'}
                          ]}
                      >
                          <Input type='number'/>
                      </Form.Item>
                      <Form.Item
                          name='cost'
                          label='Cost'
                          rules={[
                              { required: true, message: "A stock must have a cost."}
                          ]}
                          extra="Currency is in the default currency for this ticker"
                      >
                          <Input
                              addonBefore={costTypeSelector}
                              style={{width: '100%'}}
                          />
                      </Form.Item>
                      <Row justify='end' align='middle'>
                          <Col span={4}>
                              <Space>
                                  <Button type='submit' onClick={this.addStockCancel}>Cancel</Button>
                                  <Button type='primary' htmlType='submit'>Submit</Button>
                              </Space>

                          </Col>
                          <Col span={5}/>
                      </Row>
                  </Form>
              </Modal>
          </div>
        );
    }
}