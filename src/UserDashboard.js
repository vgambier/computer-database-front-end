import './Dashboard.css';
import translate from "./i18n/messages/translate";
import React, {useEffect, useState} from "react";
import {I18nProvider} from "./i18n";
import {Form, FormGroup, Input, Label, Table} from "reactstrap";
import useAxios from "axios-hooks";
import {server_url} from "./Homepage";
import User from "./User";

function UserDashboard(props) {

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

        const indexOfEntryOfId = users.map(user => user.username).indexOf(updatedUser.username);
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
        < I18nProvider locale={props.locale}>

            {!addMode ?

                <button className="button3"
                        onClick={() => setAddMode(!addMode)}><b>{translate("Add a user")}</b></button>

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
                        <Label>{translate("State")}</Label>
                        <Input placeholder="0"
                               onChange={elt => setNewUser(
                                   {
                                       ...newUser,
                                       enabled: elt.target.value
                                   }
                               )}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>{translate("Authority")}</Label>
                        <select onChange={elt => setNewUser({
                            ...newUser, authorityList: elt.target.value
                        })}>
                            <option value="2">{Roles.ADMIN}</option>
                            <option value="1">{Roles.USER}</option>
                            <option value="0">{Roles.TEST}</option>

                        </select>
                    </FormGroup>

                    <FormGroup>
                        <Label>{translate("Secondary")}</Label>
                        <select onChange={elt => setNewUser({
                            ...newUser, authorityList: elt.target.value
                        })}>
                            <option selected="selected" value="">--</option>
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
                            {translate('Username')}
                        </td>
                        <td>
                            {translate('State')}
                        </td>
                        <td>
                            {translate('Authority')}
                        </td>
                        <td>
                            {translate('Secondary')}
                        </td>
                    </tr>
                    </thead>

                    <tbody>

                    {users && users.map( // We need to check that `users` is not undefined because of asynchronicity
                        user =>
                            <tr key={user.username}>
                                <User
                                    user={user}
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

export default UserDashboard;
