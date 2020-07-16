import React, { Component } from 'react';
import { Route, BrowserRouter as Router,
         Switch, Redirect } from 'react-router-dom';
import { auth } from './services/firebase';
import { LoadingScreen } from "./components/loadingscreen";
import mainpage from "./pages/mainpage";

export function PrivateRoute({component: Component, authenticated, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authenticated === true
                ? <Component {...props}/>
                : <Redirect to={{pathname:'/login', state:{from: props.location}}}/>}
        />
    );
}

function PublicRoute({ component: Component, authenticated, ...rest}){
    console.log(authenticated);
    return(
        <Route
            {...rest}
            render={(props) => authenticated === false
                ? <Component {...props}/>
                : <Redirect to={'/mainpage'}/>
            }
        />
    );
}


export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated: false,
            loading: true,
        };
    }

    componentDidMount(){
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false,
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: true,
                });
            }
        });
    }



    render() {
        return (
            <div>

                <Router>
                    <Switch>
                        <Route exact path='/' component={mainpage}/>
                    </Switch>
                </Router>
            </div>
        )

    }

}

