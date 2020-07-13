import React, { Component, createRef } from 'react';
import {Modal, Button, Form, Input, Select, Divider, Space, Col, Row, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/stocklist.css';
import {getAllTickers, addPosition} from "../helpers/firebaseCommunication";
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
        //check the values to see if they are proper
        if (values.shares.toString().includes('.')){
            message.error('Number of shares must be whole numbers.', 15)
        } else if (isNaN(values.cost)) {
            message.error('Cost must be a number.');
        } else {
            var totalCost;
            if (values.costType === 'perShare'){
                totalCost = values.cost * values.shares;
            } else {
                totalCost = values.cost;
            }
            addPosition(values.ticker.toUpperCase(), values.exchange, values.category, values.shares, totalCost)
                .then((success) => {
                    if (success){
                        message.success('Position added successfully.')
                    } else {
                        message.error('There was an error adding the position.')
                    }
                    this.hideAddStock();
                })
        }
    }



    async addStockCancel() {
        this.hideAddStock();
    }

    showAddStock = () => {
        this.setState({visible: true});
    }

    hideAddStock = () => {
        this.setState({visible: false});
        this.formRef.current.resetFields();
    }

    testFunction = () => {
        // getAllTickers();
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
              <Button type="primary" icon={<PlusOutlined/>} onClick={this.showAddStock}/>
              <Modal
                  title="Add A Stock"
                  visible={this.state.visible}
                  okButtonProps={{disabled: this.state.formNotFilled}}
                  okText={'Add'}
                  maskClosable={false}
                  closable={false}
                  footer={[]}
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
                          name='exchange'
                          label='Stock Exchange'
                          rules={[
                              {
                                  required:true,
                                  message: 'Select an Exchange'
                              }
                          ]}
                      >
                          <Select>
                              <Option value='xtsx'>TSX</Option>
                              {/*<Option value='tsxMutual'>Mutual Fund TSX</Option>*/}
                              <Option value='us'>Any US Exchange</Option>
                          </Select>
                      </Form.Item>
                      <Form.Item
                          name='category'
                          label='Category'
                          rules={[
                              {
                                  required: true,
                                  message: 'Must belong to a category.',
                              }
                          ]}
                      >
                          <Select>
                              <Option value="tech">Technology</Option>
                              <Option value="communication">Communication</Option>
                              {/*Is this consumer non-cyc*/}
                              <Option value="conNonCyclical">Consumer Discretionary</Option>
                              <Option value="conCyclical">Consumer Staples</Option>
                              <Option value='energy'>Energy</Option>
                              <Option value="financial">Financial</Option>
                              <Option value="healthcare">Healthcare</Option>
                              <Option value="industrial">Industrial</Option>
                              <Option value="materials">Materials</Option>
                              <Option value="realestate">Real Estate</Option>
                              <Option value="util">Utilities</Option>
                              <Option value="international">International</Option>
                              <Option value="misc">Misc</Option>
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
                      >
                          <Input
                              addonBefore={costTypeSelector}
                              style={{width: '100%'}}
                          />
                      </Form.Item>
                      <Row justify='end' align='middle'>
                          <Col span={4}>
                              <Space>
                                  <Button type='primary' onClick={this.testFunction}>
                                      Test
                                  </Button>
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