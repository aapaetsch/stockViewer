// import React, { Component } from 'react';
// import { Button, Form, Input, Checkbox, message } from 'antd';
// import { GithubFilled, FacebookFilled, ChromeFilled, UserOutlined, LockOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css';
// import {signin, signInWithProvider} from "../helpers/auth";
//
// export default class Signup extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             error: null,
//             email: "",
//             password: "",
//             remember: false,
//         }
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }
//
//     handleChange = (event) =>{
//         if (event.target.name === 'remember'){
//             this.setState({
//                 remember: !this.state.remember
//             });
//         } else {
//             this.setState({
//                 [event.target.name]: event.target.value
//             });
//         }
//     }
//
//     async handleSubmit() {
//         this.setState({error: ''});
//         try{
//             await signin(this.state.email, this.state.password);
//         } catch(error) {
//             this.setState({
//                 error: error.message
//             });
//         }
//     }
//
//     async providerSignIn(providerName){
//         try{
//             signInWithProvider()
//         }
//     }
//
//     render() {
//
//         const onFinish = values => {
//             console.log('success', values);
//             this.handleSubmit();
//         }
//
//         const onFinishFailed = errorInfo => {
//             console.log('Failed login form:', errorInfo);
//             message.error('Error Authenticating.');
//         }
//
//         const formItem = {
//             width: '40%',
//             margin: 'auto',
//             marginBottom: '1em',
//             display: 'block',
//         }
//
//         return (
//             <div style={{textAlign: 'center'}}>
//                 <Modal>
//                     <Form
//                         name='normal_login'
//                         className='login-form'
//                         initialValues={{remember:false}}
//                         onFinish={onFinish}
//                         onFinishFailed={onFinishFailed}
//                         onChange={this.handleChange}>
//                         <Form.Item
//                             style={formItem}
//                             name='emailItem'
//                             rules={[{type:'email', message:'The input is not a valid Email Address!'},
//                                 {required: true, message: 'Please input your Email Address!'}]}
//                         >
//                             <Input name={'email'} prefix={<UserOutlined className='site-form-item-icon'/>} placeholder="Email"/>
//                         </Form.Item>
//                         <Form.Item
//                             style={formItem}
//                             name={'passwordItem'}
//                             rules={[{required: true, message: 'Please enter a Password!'}]}
//                         >
//                             <Input prefix={<LockOutlined className='site-form-item-icon'/>}
//                                    type='password'
//                                    name='password'
//                                    placeholder='Password'/>
//                         </Form.Item>
//                         <Form.Item>
//                             <Form.Item name='rememberedItem' valuePropName='checked' noStyle>
//                                 <Checkbox name='remember'>Remember me</Checkbox>
//                             </Form.Item>
//                             {this.props.buttonText === 'Login' ?
//                                 (<span>&nbsp;&nbsp;&nbsp;&nbsp;
//                                     <Link className='login-form-forgot' to='/'>
//                                         Forgot Password?
//                                     </Link>
//                                 </span>)
//                                 :(<div/>)}
//
//                         </Form.Item>
//                         <Form.Item>
//                             <Button style={{width:'30%'}}
//                                     type='primary'
//                                     htmlType='submit'
//                                     className='login-form-button'>
//                                 {this.props.buttonText}
//                             </Button>
//                             {this.props.buttonText === 'Login' ?
//                                 (<span><br/><br/>Or&nbsp;&nbsp;
//                                     <Link to='/signup'>Register Now!</Link></span>)
//                                 :(<span>
//                                     <br/><br/>Or&nbsp;&nbsp;
//                                     <Link to='/login'>Login Now!</Link>
//                                 </span>)}
//                         </Form.Item>
//                     </Form>
//
//                     <div style={{textAlign: 'center'}}>
//
//                         <p>{this.props.message}</p>
//                         <Button type='primary'
//                                 shape='circle'
//                                 style={{backgroundColor:'green'}}
//                                 icon={<ChromeFilled/>}
//                                 onClick={() => this.props.googleSignIn()}/>
//                         &nbsp;&nbsp;
//                         <Button type='primary'
//                                 shape='circle'
//                                 style={{backgroundColor:'black'}}
//                                 icon={<GithubFilled/>}
//                                 onClick={() => this.props.githubSignIn()}/>
//                         <hr />
//
//                     </div>
//                 </Modal>
//
//             </div>
//         );
//     }
// }