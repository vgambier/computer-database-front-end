import React, {useEffect, useState} from "react";
import {SERVER_INFO} from "./server_info";
import home from "./images/home.jpg";
import dashboard from './images/dashboard.jpg'
import dashboard2 from './images/dashboard2.jpg'
import Authentication from "./Authentication";
import ComputerDashboard from "./ComputerDashboard";
import UserDashboard from "./UserDashboard";
import {I18nProvider, LOCALES} from "./i18n";
import translate from "./i18n/messages/translate";
import english from "./images/english.jpg";
import french from "./images/french.jpg";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CompanyDashboard from "./CompanyDashboard";
import {NavLink} from 'react-router-dom'

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    // For i18n
    const [locale, setLocale] = useState(LOCALES.ENGLISH);

    const [authenticated, setAuthenticated] = useState(false);

    const [authority, setAuthority] = useState(-1);
    useEffect(() => setAuthority(authority), [authority]);

    const [enabled, setEnabled] = useState("-1");
    useEffect(() => setEnabled(enabled), [enabled]);


    return (

        <I18nProvider locale={locale}>
            <Router>

                <div id="page">

                    <div id="navigation">

                        <div id="drapeau">
                            <button className="button7" onClick={() => setLocale(LOCALES.ENGLISH)}>
                                <img src={english} alt="english" width="50"/></button>
                            <button className="button7" onClick={() => setLocale(LOCALES.FRENCH)}>
                                <img src={french} alt="french" width="44"/></button>
                        </div>

                        <div align="center">
                            <div id="center">
                                <img alt="home" src={home} width="320"/><br/>
                                {translate("CDB")}<br/>
                                <p><i>{translate("site_description")}</i></p>
                            </div>
                        </div>

                        <div id="vertical-menu">

                            {(authenticated && enabled === "1") ?
                                (authority === 2) ?

                                    <>
                                        <li><NavLink exact to="/ComputerDashboard"
                                                     activeClassName={!authenticated ? "" : "main-nav-active"}
                                                     className={!authenticated ? "" : "main-nav"}>{translate("Computers")}</NavLink>
                                        </li>
                                        <li><NavLink exact to="/CompanyDashboard"
                                                     activeClassName={!authenticated ? "" : "main-nav-active"}
                                                     className={!authenticated ? "" : "main-nav"}>{translate("Companies")}</NavLink>
                                        </li>
                                        <li><NavLink exact to="/UserDashboard"
                                                     activeClassName={!authenticated ? "" : "main-nav-active"}
                                                     className={!authenticated ? "" : "main-nav"}>{translate("Users")}</NavLink>
                                        </li>
                                    </>
                                    :
                                    <li><NavLink exact to="/ComputerDashboard"
                                                 activeClassName={!authenticated ? "" : "main-nav-active"}
                                                 className={!authenticated ? "" : "main-nav"}>{translate("Computers")}</NavLink>
                                    </li>
                                :
                                <></>}

                        </div>
                    </div>

                    <div id="main-page">

                        <div className="content">

                            <header>

                                <ul className="write">
                                    <div className="Authentication">
                                        <Authentication authenticated={authenticated}
                                                        setAuthenticated={setAuthenticated}
                                                        setStatus={setAuthority}
                                                        setEnabled={setEnabled}
                                        />

                                        {(authenticated && enabled === "1") ?
                                            (authority === 2) ?


                                                <Switch>
                                                    <Route path="/HomePage"><ComputerDashboard/></Route>
                                                    <Route path="/ComputerDashboard"><ComputerDashboard/></Route>
                                                    <Route path="/CompanyDashboard"><CompanyDashboard/></Route>
                                                    <Route path="/UserDashboard"><UserDashboard/></Route>
                                                </Switch>
                                                :
                                                <Switch>
                                                    <Route path="/HomePage"><ComputerDashboard/></Route>
                                                    <Route path="/ComputerDashboard"><ComputerDashboard/></Route>
                                                </Switch>
                                            :

                                            <></>}
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
            </Router>
        </I18nProvider>
    );
}

export default Homepage;
