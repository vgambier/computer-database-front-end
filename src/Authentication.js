import {Button, Input, Label} from "reactstrap";
import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";
import translate from "./i18n/messages/translate";
import './Dashboard.css';

function Authentication(props) {

    //useEffect(() => setAuthenticated(authenticated), [authenticated]);
    const [errorMessage, setErrorMessage] = useState("");

    // HTTP request to get a token with a given username/password pair
    const [user, setUser] = useState({username: "", password: ""});
    const [{}, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});


   /* let login = "";

    function setLogin(string) {
        login = string;
    }*/
    const[login,setLogin]=useState("");
    // Get the User authority
    const [{data: user_data}, executeLoad] = useAxios( {manual: true});


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
        let state;
        const mockUser = {username: "admin", enabled: "1", authorityList: ["ROLE_USER", "ROLE_ADMIN"]};
        setLogin(user.username);
        executeLoad({url: `${server_url}/users/` + user.username}).then(response => {
            console.log(user.username);
            console.log(login);
            console.log(response.data);
            state = maxAuthority(response.data);
            console.log(state);
        });
        return state;
    }

    function onLogin() {

        executeLogin()
            .then(
                response => {
                    localStorage.setItem('bearerToken', response.data.token);
                    axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`};
                    props.setAuthenticated(true);
                })
            .catch(() => {
                setErrorMessage("Incorrect credentials. Please try again.");
            })
    }

    function onLogout() {

        localStorage.removeItem('bearerToken');
        localStorage.clear();
        props.setAuthenticated(false);
    }

    return (

        <div className="Authentication">

            {!props.authenticated ?
                <div id="login">
                    <Label>{translate("Username")}</Label>
                    <Input type="text" placeholder="Gaëtan"
                           onChange={elt => setUser({...user, username: elt.target.value})}/>
                    <Label>{translate("Password")}</Label>
                    <Input type="password" placeholder="123456"
                           onChange={elt => setUser({...user, password: elt.target.value})}/>
                    <Button onClick={() => onLogin() & checkAuthority()}>{translate("Login")}</Button>
                    {errorMessage}
                </div>

                :
                <div id="login">
                    <Button onClick={() => onLogout()}>{translate("Logout")}</Button>
                </div>
            }

        </div>
    );
}

export default Authentication;
