import React, { Component } from 'react';
import {Modal, Button, Form, Input, Select, Divider, Space, Col, Row} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/stocklist.css';
const { Option } = Select;

export default class AddStock extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            costTypeSize: 110,
            formNotFilled: true,
            costType: 'perShare',
            ticker: null,
            category: 'misc',
            shares: null,
            cost: null,
        }
        this.addStockOk = this.addStockOk.bind(this);
        this.addStockCancel = this.addStockCancel.bind(this);
        this.showAddStock = this.showAddStock.bind(this);
        // this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    addStockOk = e => {
        this.setState({
            visible: false,
            formNotFilled: true,
        });
        //TODO: add logic for adding a stock
    }

    addStockCancel = e => {
        this.setState({
            visible: false,
            formNotFilled: true,
            costType: 'perShare',
            ticker: null,
            category: 'misc',
            shares: null,
            cost: null,
        });
        //TODO: add logic for canceling adding a stock
    }

    showAddStock = () =>{
        this.setState({
            visible: true,
        });
    }

    // handleFormChange(event,e) {
    //     for (let key in event){
    //         this.setState({
    //             [key]: event[key],
    //         });
    //     }
    //
    //     if (this.state.ticker !== null && this.state.shares !== null && this.state.cost !== null ){
    //         this.setState({
    //             formNotFilled: false,
    //         });
    //     }
    //     console.log(this.state);
    //
    // }
    handleFieldChange(event,fields){
        // console.log(event[0],e);
        // if (event !== undefined){
        //     event[0].name
        // }
        //
        // fields
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
              <Button type="primary" icon={<PlusOutlined/>} onClick={this.showAddStock}/>
              <Modal
                  title="Add A Stock"
                  visible={this.state.visible}
                  okButtonProps={{disabled: this.state.formNotFilled}}
                  okText={'Add'}
                  maskClosable={false}
                  closable={false}
                  onOk={this.addStockOk}
                  onCancel={this.addStockCancel}
                  >
                  <Form
                      {...formItemLayout}
                      layout='horizontal'
                      size='small'
                      initialValues={{
                          costType: 'perShare',
                      }}
                      onFinish={this.onFinish}
                      // onValuesChange={this.handleFormChange}
                      onFieldsChange={this.handleFieldChange}
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
                              {
                                  required: true,
                                  message: 'Must have at least 1 share.',
                              },
                          ]}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name='cost'
                          label='Cost'
                          rules={[
                              {
                                  required: true,
                                  message: "A stock must have a cost.",
                              }
                          ]}
                      >
                          <Input
                              addonBefore={costTypeSelector}
                              style={{width: '100%'}}
                          />
                      </Form.Item>
                  </Form>
              </Modal>
          </div>
        );
    }
}