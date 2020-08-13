import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {Button, Input} from "reactstrap";
import {SERVER_INFO} from "./server_info";
import Dashboard from "./Dashboard";
import home from "./images/home.jpg";
import dashboard from './images/dashboard.jpg'
import dashboard2 from './images/dashboard2.jpg'

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

        <body>

            <div id="page">
                <div id="navigation">
                    <p align="center">
                        <div id="center">
                            <a href="home.html"><img src={home} alt="Application de bases de données d’ordinateurs" width="320"/></a><br/>
                            COMPUTER DATABASE,<br/>
                            <p><i>Application of computer databases</i></p>
                        </div>
                    </p>

                    <div id="vertical-menu">
                        <li><a href="home.html" className={authenticated? "": "active"}>Home</a></li>
                        <li><a href="dashboard.html" className={!authenticated? "": "active"}>Dashboard</a></li>
                    </div>
                </div>

            <div id="main-page">
                <div className="content">

                    <footer>

                        <ul className="horizontal-menu">

                            {!authenticated ?
                                <div id="login">
                                    <Input type="text" placeholder="Username" onChange={elt => setUser({...user, username: elt.target.value})}/>
                                    <Input type="password" placeholder="Password" onChange={elt => setUser({...user, password: elt.target.value})}/>
                                    <Button onClick={() => loginSubmit()}>Login</Button>
                                    {errorMessage}
                                </div>
                                :
                                <Dashboard/>
                            }

                        </ul>

                    </footer>

                    <div className="Homepage">

                    <div id="moncadre" hidden={authenticated}>
                        <div class="slider">
                            <div class="slides">
                                <div class="slide"><img src={dashboard} alt="dashboard" /></div>
                                <div class="slide"><img src={dashboard2} alt="dashboard" /></div>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
            </div>
        </body>
    );
}

export default Homepage;