import React, {useState} from "react";
import {SERVER_INFO} from "./server_info";
import home from "./images/home.jpg";
import dashboard from './images/dashboard.jpg'
import dashboard2 from './images/dashboard2.jpg'
import Authentication from "./Authentication";
import axios from "axios";
import Dashboard from "./Dashboard";
import Users from "./Users";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    const [authenticated, setAuthenticated] = useState(false);
    const [mode, setMode] = useState(true);

    function loginIfTokenExists() {
        if (!authenticated && localStorage.getItem('bearerToken')) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`};
            setAuthenticated(true);
        }
    }

    return (

        <div id="page">
            {loginIfTokenExists()}
            <div id="navigation">
                <div align="center">
                    <div id="center">
                        <img src={home} alt="Application de bases de données d’ordinateurs" width="320"/><br/>
                        COMPUTER DATABASE,<br/>
                        <p><i>Application of computer databases</i></p>
                    </div>
                </div>

                <div id="vertical-menu">
                    <li><a className={authenticated ? "" : "active"}>Home</a></li>
                    <li><a className={!authenticated ? "" : "active"}>Dashboard</a></li>
                    <li><a className={!authenticated ? "" : "active"}>My Account</a></li>
                    <button onClick={() => setMode(!mode)}> SWITCH</button>
                </div>
            </div>

            <div id="main-page">

                <div className="content">

                    <header>

                        <ul className="write">
                            <div className="Authentication">
                                <Authentication authenticated={authenticated} setAuthenticated={setAuthenticated}/>

                                {authenticated ?
                                    mode ?
                                        <Dashboard/>
                                        :
                                        <Users/>
                                    : <></>}

                            </div>
                        </ul>

                    </header>

                    <div className="Homepage">

                        <div id="moncadre" hidden={authenticated}>
                            <div className="slider">
                                <div className="slides">
                                    <div className="slide"><img src={dashboard} alt="dashboard"/></div>
                                    <div className="slide"><img src={dashboard2} alt="dashboard2"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
