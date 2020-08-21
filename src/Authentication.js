import {Button, Input} from "reactstrap";
import React, {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import {server_url} from "./Homepage";
import translate from "./i18n/messages/translate";
import './Dashboard.css';
import Modal from "react-modal";
import {AvField, AvForm} from "availity-reactstrap-validation";

function Authentication(props) {

    const [errorMessage, setErrorMessage] = useState("");
    const [authority, setAuthority] = useState("");
    useEffect(() => setAuthority(authority), [authority]);

    // HTTP request to get a token with a given username/password pair
    const userInit = {username: "", password: ""};
    const [user, setUser] = useState(userInit);
    const [, executeLogin] = useAxios({
        url: `${server_url}/authenticate`,
        method: "POST",
        data: user
    }, {manual: true});

    // HTTP request to get user info from token
    const [, getUserFromToken] = useAxios({
        url: `${server_url}/users/userFromToken`,
        method: "POST"
    }, {manual: true});

    const [login, setLogin] = useState("");
    // Get the User authority
    const [, executeLoad] = useAxios({manual: true});

    const newUserInit = {
        username: "",
        password: "",
    };

    const [newUser, setNewUser] = useState(newUserInit);

    function resetValues() {
        setNewUser(newUserInit);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    // Modal / Pop-up
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    function closeAddModal() {
        setIsAddModalOpen(false);
    }

    // Add a user
    const [, executeAdd] = useAxios({
        url: `${server_url}/users/add`,
        method: "POST"
    }, {manual: true});

    function addUser() {
        console.log(newUser);
        executeAdd({data: newUser});
        closeAddModal();
    }


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
            props.setStatus(maxAuthority(response.data));
            props.setEnabled(response.data.enabled);
        });
    }

    function loginIfTokenExists() {
        
        if (localStorage.getItem('bearerToken')) {
            const bearerToken = localStorage.getItem('bearerToken');

            axios.defaults.headers.common = {'Authorization': `Bearer ${bearerToken}`}; // All axios calls now use the bearer token as a header
            props.setAuthenticated(true); // The website now displays whatever an authenticated should be able to see

            const json = {jwtToken: bearerToken};

            getUserFromToken({data: json}).then(response => {
                    setLogin(response.data.username);
                    props.setStatus(maxAuthority(response.data));
                    props.setEnabled(response.data.enabled);
                }
            ).catch(e => {
                console.log("An error occurred:");
                console.log(e);
            });
        }
    }

    useEffect(() => loginIfTokenExists(), []);

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
        props.setEnabled(-1);
        props.setAuthenticated(false);

        // Resetting form
        setUser(userInit);
    }


    function handleKeypress (event) {
        if(event.keyCode === 13){
            onLogin()
        }
    }

    return (

        <div className="Authentication">


            {!props.authenticated ?
                <div id="login">
                    {translate("Username")}
                    <Input type="text" placeholder="Gaëtan"
                           onChange={elt => setUser({...user, username: elt.target.value})}/>&nbsp;
                    {translate("Password")}
                    <Input type="password" placeholder="123456"
                           onChange={elt => setUser({...user, password: elt.target.value})}
                           onKeyDown={handleKeypress}/>&nbsp;
                    <Button onClick={() => onLogin()}>{translate("Login")}</Button>&nbsp;
                    {errorMessage}&nbsp;&nbsp;


                    <button className="button3"
                            onClick={() => setIsAddModalOpen(!isAddModalOpen)}><b>{translate("Add a user")}</b></button>

                    <Modal isOpen={isAddModalOpen}
                           onAfterOpen={resetValues}
                           onRequestClose={closeAddModal}
                           style={customStyles}
                           contentLabel="Add a user">
                        <h3> {translate("Add a user")}</h3>

                        <AvForm>
                            <AvField name="name"
                                     label={translate("Username")} type="text"
                                     placeholder="Fancy User #15"
                                     onChange={elt => setNewUser(
                                         {
                                             ...newUser,
                                             username: elt.target.value
                                         })}/>
                            <br/>
                            <AvField
                                name="password" type="text"
                                label={translate("Password")}
                                placeholder="123456"
                                onChange={elt => setNewUser(
                                    {
                                        ...newUser,
                                        password: elt.target.value
                                    })}
                            />


                            <button className="button3" onClick={() => addUser()}>{translate("Confirm")}</button>

                            <Button className="button" onClick={() => closeAddModal()}>{translate("Cancel")}</Button>

                        </AvForm>
                    </Modal>
                </div>


                :
                <div id="login">
                    {translate("logged_as")} {login}
                    <Button className="button6" onClick={() => onLogout()}>{translate("Logout")}</Button>
                </div>
            }

        </div>
    );
}

export default Authentication;
