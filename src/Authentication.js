import {Button, Input} from "reactstrap";
import Dashboard from "./Dashboard";
import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";

function Authentication() {

    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => setAuthenticated(authenticated), [authenticated]);
    const [errorMessage, setErrorMessage] = useState("");

    // HTTP request to get a token with a given username/password pair
    const [user, setUser] = useState({username: "", password: ""});
    const [{}, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});

    function onLogin() {

        executeLogin()
            .then(
                response => {
                    localStorage.setItem('bearerToken', response.data.token);
                    axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                    setAuthenticated(true);
                })
            .catch(() => {
                setErrorMessage("Incorrect credentials. Please try again.");
            })
    }

    function onLogout() {

        localStorage.removeItem('bearerToken');
        localStorage.clear();
        setAuthenticated(false);
    }

    function loginIfTokenExists() {
        if(!authenticated && localStorage.getItem('bearerToken')) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`};
            setAuthenticated(true);
        }
    }

    return (

        <div className="Authentication">

            {loginIfTokenExists()}

            {!authenticated ?

                <>
                    Log in:
                    Username: <Input type="text" onChange={elt => setUser({...user, username: elt.target.value})}/>
                    Password: <Input type="password" onChange={elt => setUser({...user, password: elt.target.value})}/>
                    <Button onClick={() => onLogin()}>Login</Button>
                    {errorMessage}
                </>

                :

                <>
                    <Button onClick={() => onLogout()}>Logout</Button>
                    <Dashboard/>
                </>

            }

        </div>
    );
}

export default Authentication;