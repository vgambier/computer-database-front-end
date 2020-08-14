import React, {useEffect, useState} from "react";
import {SERVER_INFO} from "./server_info";
import home from "./images/home.jpg";
import dashboard from './images/dashboard.jpg'
import dashboard2 from './images/dashboard2.jpg'
import Authentication from "./Authentication";
import axios from "axios";
import translate from "./i18n/messages/translate";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    // Setting page title
    useEffect(() => {
        document.title = "Welcome!"
    }, []);

    const [authenticated, setAuthenticated] = useState(false);

    function loginIfTokenExists() {
        if(!authenticated && localStorage.getItem('bearerToken')) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`};
            setAuthenticated(true);
        }
    }

    return (

    <body>
    {loginIfTokenExists()}

            <div id="page">
                <div id="navigation">
                    <p align="center">
                        <div id="center">
                            <img src={home} alt="Application de bases de données d’ordinateurs" width="320"/><br/>
                            COMPUTER DATABASE,<br/>
                            <p><i>Application of computer databases</i></p>
                        </div>
                    </p>

                    <div id="vertical-menu">
                        <li><a className={authenticated? "": "active"}>Home</a></li>
                        <li><a className={!authenticated? "": "active"}>Dashboard</a></li>
                    </div>
                </div>

            <div id="main-page">
                <div className="content">

                    <header>

                        <ul className="horizontal-menu">

                            <div className="Homepage">

                            <Authentication authenticated={authenticated} setAuthenticated={setAuthenticated}/>

                            </div>

                        </ul>

                    </header>

                    <div className="Homepage">

                    <div id="moncadre" hidden={authenticated}>
                        <div class="slider">
                            <div class="slides">
                                <div class="slide"><img src={dashboard} alt="dashboard" /></div>
                                <div class="slide"><img src={dashboard2} alt="dashboard2" /></div>
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