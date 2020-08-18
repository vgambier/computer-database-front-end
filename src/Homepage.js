import React, {useState} from "react";
import {SERVER_INFO} from "./server_info";
import home from "./images/home.jpg";
import dashboard from './images/dashboard.jpg'
import dashboard2 from './images/dashboard2.jpg'
import Authentication from "./Authentication";
import axios from "axios";
import Dashboard from "./Dashboard";
import Users from "./Users";
import {I18nProvider, LOCALES} from "./i18n";
import translate from "./i18n/messages/translate";
import english from "./images/english.jpg";
import french from "./images/french.jpg";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    // For i18n
    const [locale, setLocale] = useState(LOCALES.ENGLISH);

    const [authenticated, setAuthenticated] = useState(false);
    const [mode, setMode] = useState(true);

    function loginIfTokenExists() {
        if (!authenticated && localStorage.getItem('bearerToken')) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`};
            setAuthenticated(true);
        }
    }

    return (

        <I18nProvider locale={locale}>
            <div id="page">
                {loginIfTokenExists()}
                <div id="navigation">
                    <div align="center">
                        <div id="center">
                            <img src={home} alt="Application de bases de données d’ordinateurs" width="320"/><br/>
                            {translate("CDB")},<br/>
                            <p><i>{translate("desc")}</i></p>
                        </div>
                    </div>

                    <div id="vertical-menu">
                        <li><a path="/Homepage" className={authenticated ? "" : "active"}>{translate("Home")}</a></li>
                        <li><a className={!authenticated ? "" : "active"}>{translate("Dashboard")}</a></li>
                        <li><a>{translate("Users")}</a></li>
                        <button onClick={() => setMode(!mode)}> SWITCH</button>
                    </div>
                </div>

                <div id="main-page">

                    <div className="content">

                        <header>

                            <div id="drapeau">
                                <button className="button7" onClick={() => setLocale(LOCALES.ENGLISH)}>
                                    <img src={english} alt="english" width="58"/></button>
                                <button className="button7" onClick={() => setLocale(LOCALES.FRENCH)}>
                                    <img src={french} alt="french" width="50"/></button>
                            </div>

                            <ul className="write">
                                <div className="Authentication">
                                    <Authentication authenticated={authenticated} setAuthenticated={setAuthenticated}/>

                                    {authenticated ?
                                        mode ?
                                            <Dashboard  locale={locale}/>
                                            :
                                            <Users  locale={locale}/>
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
        </I18nProvider>
    );
}

export default Homepage;
