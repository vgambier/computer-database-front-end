import {Button, Input} from "reactstrap";
import Dashboard from "./Dashboard";
import React, {useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";

function Authentication() {

    const [errorMessage, setErrorMessage] = useState("");

    // HTTP request to get a token with a given username/password pair
    const [user, setUser] = useState({username: "", password: ""});
    const [{}, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});

    function loginSubmit() {

        executeLogin()
            .then(
                response => {
                    axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                    localStorage.setItem('bearerToken', response.data.token);
                })
            .catch(() => {
                setErrorMessage("Incorrect credentials. Please try again.");
            })
    }

    return (

        <div className="Authentication">

            {!localStorage.getItem('bearerToken') ?
                <>
                    Log in:
                    Username: <Input type="text" onChange={elt => setUser({...user, username: elt.target.value})}/>
                    Password: <Input type="password" onChange={elt => setUser({...user, password: elt.target.value})}/>
                    <Button onClick={() => loginSubmit()}>Login</Button>
                    {errorMessage}
                </>
                :
                <Dashboard/>
            }

        </div>
    );
}

export default Authentication;