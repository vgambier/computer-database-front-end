import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {Button} from "reactstrap";
import {SERVER_INFO} from "./server_info";
import {CREDENTIALS} from "./credentials";
import Dashboard from "./Dashboard";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    let [authenticated, setAuthenticated] = useState(false);

    // Setting page title
    useEffect(() => {
        document.title = "Welcome!"
    }, []);

    // Authentication

    const [{}, getToken] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: {username: CREDENTIALS.username, password: CREDENTIALS.password}
    })

    function applyToken() {
        getToken().then(response => {
                axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                setAuthenticated(true);
            }
        )
    }

    return (

        <div className="Homepage">

            {!authenticated ?
                <>
                Please login
                <Button onClick={() => applyToken()}> Login </Button>
                </>
                :
                <Dashboard/>
            }

        </div>
    );
}

export default Homepage;