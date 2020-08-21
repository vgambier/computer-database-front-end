import {Button, Input, Label} from "reactstrap";
import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";
import translate from "./i18n/messages/translate";
import './Dashboard.css';

function Authentication(props) {

    const [errorMessage, setErrorMessage] = useState("");
    const [authority, setAuthority] = useState("");
    useEffect(() => setAuthority(authority), [authority]);

    // HTTP request to get a token with a given username/password pair
    const userInit = {username: "", password: ""};
    const [user, setUser] = useState(userInit);
    const [{}, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});

    const [login, setLogin] = useState("");
    // Get the User authority
    const [{data: user_data}, executeLoad] = useAxios({manual: true});


    const Roles = {
        ROLE_ADMIN: 2,
        ROLE_USER: 1,
        ROLE_TEST: 0,
    };

    function getValue(key) {
        return Roles[key];
    }

    function maxAuthority(response) {
        let temp = response.authorityList.map(elt => getValue(elt));
        temp = Math.max.apply(Math, temp);
        console.log(temp);
        return temp;
    }

    function checkAuthority() {
        setLogin(user.username);
        executeLoad({url: `${server_url}/users/` + user.username}).then(response => {
            console.log(user.username);
            console.log(response.data);
            props.setStatus(maxAuthority(response.data));
        });
    }

    function loginIfTokenExists() {
        if (!props.authenticated && localStorage.getItem('bearerToken')) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('bearerToken')}`};
            props.setAuthenticated(true);
        }
    }

    function onLogin() {

        executeLogin()
            .then(
                response => {
                    localStorage.setItem('bearerToken', response.data.token);
                    axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                    props.setAuthenticated(true);
                    checkAuthority();
                })
            .catch(() => {
                setErrorMessage("Incorrect credentials. Please try again.");
            })
    }

    function onLogout() {

        // Cleaning local storage
        localStorage.removeItem('bearerToken');
        localStorage.clear();

        props.setStatus(-1);
        props.setAuthenticated(false);

        // Resetting form
        setUser(userInit);
    }

    return (

        <div className="Authentication">

            {loginIfTokenExists()}

            {!props.authenticated ?
                <div id="login">
                    {translate("Username")}
                    <Input type="text" placeholder="Gaëtan"
                           onChange={elt => setUser({...user, username: elt.target.value})}/>&nbsp;
                    {translate("Password")}
                    <Input type="password" placeholder="123456"
                           onChange={elt => setUser({...user, password: elt.target.value})}/>&nbsp;
                    <Button onClick={() => onLogin()}>{translate("Login")}</Button>&nbsp;
                    {errorMessage}&nbsp;&nbsp;
                </div>

                :
                <div id="login">
                    <Button className="button6" onClick={() => onLogout()}>{translate("Logout")}</Button>
                </div>
            }

        </div>
    );
}

export default Authentication;
