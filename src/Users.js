import './Dashboard.css';
import translate from "./i18n/messages/translate";
import React, {useEffect, useState} from "react";
import {I18nProvider, LOCALES} from "./i18n";
import english from "./images/english.jpg";
import french from "./images/french.jpg";
import {Form, FormGroup, Input, Label, Table} from "reactstrap";
import useAxios from "axios-hooks";
import {server_url} from "./Homepage";
import User from "./User";

function Users(props) {

    // Get all users
    const [{data}] = useAxios(
        `${server_url}/users/`);
    const [users, setUsers] = useState(data); // Grabbing data from the dataset

    const [addMode, setAddMode] = useState(false);

    const [newUser, setNewUser] = useState({
        username: "",
        enabled: "",
        authorityList: "",
    });


    // Add one computer
    const [{}, executeAdd] = useAxios({
        url: `${server_url}/users`,
        method: "POST"
    }, {manual: true});

    // Delete one computer
    const [{}, executeDelete] = useAxios({
        method: "DELETE"
    }, {manual: true});

    // Edit one computer
    const [{}, executeEdit] = useAxios({
        url: `${server_url}/users`,
        method: "PUT"
    }, {manual: true});


    function addUser() {
        setAddMode(!addMode);
        executeAdd({data: newUser}).then(
            response => {
                newUser.id = response.data.toString();
                setUsers(users => [...users, newUser]);
            });
    }

    // Editing logic
    function editUser(updatedUser) {

        const indexOfEntryOfId = users.map(user => user.id).indexOf(updatedUser.id);
        executeEdit({data: updatedUser}).then(() => {
            const newUsers = [...users];
            newUsers[indexOfEntryOfId] = updatedUser;
            setUsers(newUsers);
        });
    }

    // Deleting logic
    function deleteUser(username) {
        console.log(username);
        executeDelete({url: `${server_url}/users/${username}`}).then(() => {
            const newUsers = users.filter(user => user.username !== username);
            setUsers(newUsers);
        });
    }

    // Use effects
    useEffect(() => setUsers(data), [data]);
    useEffect(() => setNewUser(newUser), [newUser]);

    const Roles = {
        ADMIN: "ROLE_ADMIN",
        USER: "ROLE_USER",
        TEST: "ROLE_TEST",
    }

    return (
        < I18nProvider
            locale={props.locale}>
            <div
                className="Users">

                <div id="drapeau">
                    <button className="english" onClick={() => props.setLocale(LOCALES.ENGLISH)}>
                        <img src={english} alt="english" width="20"/></button>
                    <button className="french" onClick={() => props.setLocale(LOCALES.FRENCH)}>
                        <img src={french} alt="french" width="20"/></button>
                </div>
            </div>

            {!addMode ?

                <button className="button3"
                        onClick={() => setAddMode(!addMode)}><b>{translate("Add a User")}</b></button>

                :

                <Form>
                    <FormGroup>
                        <Label>{translate("Username")}</Label>
                        <Input placeholder="Fancy User #15"
                               onChange={elt => setNewUser(
                                   {
                                       ...newUser,
                                       username: elt.target.value
                                   })}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>{translate("Introduced")}</Label>
                        <Input type="datetime"
                               placeholder="2001-12-31"
                               onChange={elt => setNewUser(
                                   {
                                       ...newUser,
                                       introduced: elt.target.value
                                   }
                               )}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>{translate("authorityList")}</Label>
                        <select onChange={elt => setNewUser({
                            ...newUser, authorityList: elt.target.value
                        })}>
                            <option value="2">{Roles.ADMIN}</option>
                            <option value="1">{Roles.USER}</option>
                            <option value="0">{Roles.TEST}</option>

                        </select>
                    </FormGroup>

                    <button onClick={() => addUser()}>Confirm</button>
                </Form>
            }


            <div id="table">

                {<Table>

                    <thead>
                    <tr>
                        <td>
                            Username
                        </td>
                        <td>
                            State
                        </td>
                        <td>
                            Authority
                        </td>
                    </tr>
                    </thead>

                    <tbody>

                    {users && users.map( // We need to check that `users` is not undefined because of asynchronicity
                        user =>
                            <tr key={user.username}>
                                <User
                                    user={users}
                                    delete={deleteUser}
                                    edit={editUser}
                                    locale={props.locale}
                                /></tr>
                    )}

                    </tbody>

                </Table>}

            </div>

        </I18nProvider>
    )
}

export default Users;
