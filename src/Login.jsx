// Login.jsx
import React, {Component} from 'react';
import {Link} from "react-router-dom";

const host = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:4321/'


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        return fetch(`${host}admin/login`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': "http://localhost:4321"
            }
        })
            .then(res => {

                console.log('lr', res);
                if (res.status === 200) {
                    this.props.history.push('/admin');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    render() {
        return (
            <div className={'container d-flex flex-column mt-4 align-items-center h-100'}>
                <Link to={'/'}>
                    <i className={'fa fa-home fa-2x text-light'}>
                    </i>
                </Link>
                <h1 className={'mb-2'}>Login Below!</h1>
                <form onSubmit={this.onSubmit} className={'text-center'}>
                    <div className={'input-group'} style={{maxWidth: '300px'}}>
                        <input
                            type="password"
                            name="password"
                            className={'form-control'}
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <button className={'my-2 btn btn-primary'} type="submit" >
                        Login
                    </button>
                </form>
            </div>
        );
    }
}
