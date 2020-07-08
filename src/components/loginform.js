import React, { Component } from 'react';
import { Button, Form, Input, Checkbox, message } from 'antd';
import { GithubFilled, FacebookFilled, ChromeFilled, UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
    }



    render() {

        const onFinish = values => {

        }

        const onFinishFailed = errorInfo => {
            console.log('Failed login form:', errorInfo);
            message.error('Error Authenticating.');
        }

        const formItem = {
            width: '40%',
            margin: 'auto',
            marginBottom: '1em',
            display: 'block',
        }

        return (
            <div>

            </div>
        );
    }
}