import React, { Component, createRef } from 'react';
import {
    Button, Modal, Form, Drawer,
    Input, Checkbox, message,
    Divider, Space, Row, Col
       } from 'antd';
import { auth } from 'firebase';
import { GithubFilled, ChromeFilled, UserOutlined, LockOutlined, LockTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../styles/login.css';
import {sessionPersistence, signInWithProvider, signin, signup} from "../helpers/auth";


export default class Authenticate extends Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            remembered: false,
            visible: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.providerSignIn = this.providerSignIn.bind(this);
        this.formRef = createRef();

    }

    async handleSubmit(values){
        this.setState({error:''});
        console.log(this.state);

        try{
            if (this.props.title === 'Login'){

                signin(values['emailItem'], values['passwordItem'])
                    .then((result) =>{
                        if(result !== false){
                            sessionPersistence(result, this.state.remember);
                            message.success('Signed in as: ' + auth().currentUser.email.toString());
                        } else {
                            message.error('Error Signing In.');
                        }
                    } );

            } else {

                if (values['passwordItem'] === values['confirmPasswordItem']){
                    signup(values['emailItem'], values['passwordItem'])
                        .then((result) =>{
                            if(result !== false){
                                sessionPersistence(result, this.state.remember);
                                message.success('Signed in as: ' + auth().currentUser.email.toString());
                            } else {
                                message.error('Error Signing Up.');
                            }
                        });
                } else {
                    message.error('Passwords do not match.');
                    return;
                }
            }

        } catch(error){

            console.log(error);
            this.setState({error: error.message});

            if (this.props.title === 'Login'){
                message.error('Error Signing In');
            }
            else {
                message.error('Error:'+error.message);
            }
        }
        this.hideAuthentication();
    }

    async providerSignIn(providerName){

        try{
            //TODO: fix signin session persistence

            signInWithProvider(providerName)
                .then((result) =>{
                    if(result !== false){
                        message.success('Signed in as: ' + auth().currentUser.displayName);
                        sessionPersistence(result, this.state.remember);
                    } else {
                        message.error('Error Signing in with '+ providerName);
                    }
                } );


        } catch(error) {

            this.setState({error: error.message});

            if (this.props.title === 'Login'){
                message.error('There was an error logging in.');
            } else {
                message.error('There was an error creating your account.');
            }
        }
        this.hideAuthentication();
    }
    hideAuthentication = () => {
        console.log('click');
        this.setState({visible:false});
        try {
            this.formRef.current.resetFields();
        } catch(error){
            console.log(error);
        }
    }

    render(){
        const onFinishFailed = errorInfo => {
            message.error('Error in Authentication');
        }
        return(
            <div>
                <Button type='primary' onClick={() => this.setState({visible:true})}>
                    {this.props.title}
                </Button>
                <Modal
                    title={(<h2 style={{textAlign: 'center'}}>{this.props.title}</h2>)}
                    visible={this.state.visible}
                    onCancel={this.hideAuthentication}
                    footer={[]}>
                    <Form
                        name='normal_login'
                        className='login-form'
                        ref={this.formRef}
                        initialValues={{remember: false}}
                        onFinish={this.handleSubmit}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name='emailItem'
                            rules={[
                                {type: 'email', message: 'The input is not a valid Email Address.'},
                                {required: true, message: 'Please input your Email Address'}
                            ]}
                        >
                            <Input
                                name='email'
                                prefix={<UserOutlined className='site-form-item-icon'/>}
                                placeholder="Email"/>
                        </Form.Item>
                        <Form.Item
                            name='passwordItem'
                            rules={[{required:true, message: 'Please enter a Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className='site-form-item-icon'/>}
                                type='password'
                                name='password'
                                placeholder='Password'/>
                        </Form.Item>
                        { this.props.title !== 'Login' ?
                            (<Form.Item
                                    name='confirmPasswordItem'
                                    rules={[{required: true, message: 'Passwords must match!'}]}
                                >
                                    <Input
                                        prefix={<LockTwoTone className='site-form-item-icon'/>}
                                        type='password'
                                        name='matchingPassword'
                                        placeholder='Retype Password'/>
                                </Form.Item>
                            ) : (<div/>)
                        }
                        <div id='signInGroup' style={{textAlign:'center'}}>
                            <Space>
                                <Checkbox
                                    onChange={() => this.setState({remember: !this.state.remember})}
                                >
                                    Remember Me
                                </Checkbox>
                                &nbsp;
                                {/*TODO: add switch between login and signup*/}

                            </Space>
                            <br/>
                            <Button
                                className='authenticateButton'
                                style={{backgroundColor: '#389e0d'}}
                                htmlType='submit'
                            >
                                {this.props.title}
                            </Button>
                            <h3>OR</h3><br/>
                            <Button
                                className='authenticateButton'
                                type='primary'
                                icon={<GithubFilled/>}
                                onClick={() => this.providerSignIn('git') }
                            >
                                Continue with Github
                            </Button>
                            <br/>
                            <Button
                                className='authenticateButton'
                                type='primary'
                                icon={<ChromeFilled/>}
                                onClick={() => this.providerSignIn('google') }
                            >
                                Continue with Google
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}