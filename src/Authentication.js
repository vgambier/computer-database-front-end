import {Button, Input, Label} from "reactstrap";
import Dashboard from "./Dashboard";
import React, {useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";
import './Dashboard.css';
import translate from "./i18n/messages/translate";

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
                    <Input type="text" placeholder="Gaëtan" onChange={elt => setUser({...user, username: elt.target.value})}/>
                    <Label>{translate("Password")}</Label>
                    <Input type="password" placeholder="123456" onChange={elt => setUser({...user, password: elt.target.value})}/>
                    <Button onClick={() => onLogin()}>{translate("Login")}</Button>
                    {errorMessage}
                </div>

                :
                    <Button onClick={() => onLogout()}>{translate("Logout")}</Button>
            }

        </div>
    );
}

export default Authentication;
