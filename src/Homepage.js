import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {Button, Input} from "reactstrap";
import {SERVER_INFO} from "./server_info";
import Dashboard from "./Dashboard";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    let [authenticated, setAuthenticated] = useState(false);

    // Setting page title
    useEffect(() => {
        document.title = "Welcome!"
    }, []);

    // Authentication

    const [user, setUser] = useState({username: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");

    const [{}, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});

    function loginSubmit() {

        console.log(user);

        executeLogin()
            .then(
                response => {
                    axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                    setAuthenticated(true);
                })
            .catch(() => {
                setErrorMessage("Incorrect credentials. Please try again.");
            })
    }

    return (

        <div className="Homepage">

            {!authenticated ?
                <>
                    Log in:<br/>

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

export default Homepage;