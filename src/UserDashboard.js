import './Dashboard.css';
import translate from "./i18n/messages/translate";
import React, {useEffect, useState} from "react";
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
        password: "",
        enabled: "0",
        authorityList: [],
    });


    // Add a user
    const [{}, executeAdd] = useAxios({
        url: `${server_url}/users/add`,
        method: "POST"
    }, {manual: true});

    // Delete a user
    const [{}, executeDelete] = useAxios({
        method: "DELETE"
    }, {manual: true});

    // Edit user ROLES
    const [{}, executeEdit] = useAxios({
        url: `${server_url}/users`,
        method: "PUT"
    }, {manual: true});

    // ENABLE User
    const [{}, executeEnable] = useAxios({
        method: "POST"
    }, {manual: true});

    // DISABLE  User
    const [{}, executeDisable] = useAxios({
        url: `${server_url}/users/disable`,
        method: "POST"
    }, {manual: true});


    function addUser() {
        setAddMode(!addMode);
        console.log(newUser);
        executeAdd({data: newUser}).then(
            () => {
                setUsers(users => [...users, newUser]);
            });
    }

    // Editing logic
    function editUser(updatedUser) {
        const indexOfEntryOfId = users.map(user => user.username).indexOf(updatedUser.username);
       /* executeEdit({data: updatedUser}).then(() => {
            const newUsers = [...users];
            newUsers[indexOfEntryOfId] = updatedUser;
            setUsers(newUsers);
        });*/
        if (updatedUser.enabled ==="0") {
            executeDisable(  { url: `${server_url}/users/disable/`+updatedUser.username}).then(() => {
                const newUsers = [...users];
                newUsers[indexOfEntryOfId] = updatedUser;
                setUsers(newUsers);
            });
        } else {
            executeEnable({ url: `${server_url}/users/enable/`+updatedUser.username}).then(() => {
                const newUsers = [...users];
                newUsers[indexOfEntryOfId] = updatedUser;
                setUsers(newUsers);
            });
        }
    }

    // Deleting logic
    function deleteUser(username) {
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
        <div>
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
                        <Label>{translate("Password")}</Label>
                        <Input placeholder="123456"
                               onChange={elt => setNewUser(
                                   {
                                       ...newUser,
                                       password: elt.target.value
                                   })}/>
                    </FormGroup>


                    <FormGroup>
                        <Label>{translate("Authority")}</Label>
                        <select onChange={elt => {
                            newUser.authorityList.push(elt.target.value);
     /*                       setNewUser({
                                ...newUser, {newUser.authorityList}
                            })*/
                        }}>
                            <option selected="selected" value="">--</option>
                            <option value={Roles.TEST}>{Roles.TEST}</option>
                            <option value={Roles.USER}>{Roles.USER}</option>
                            <option value={Roles.ADMIN}>{Roles.ADMIN}</option>

                        </select>
                    </FormGroup>

                    <FormGroup>
                        <Label>{translate("Secondary")}</Label>
                        <select onChange={elt => {
                            newUser.authorityList.push(elt.target.value);
                         /*   setNewUser({
                                ...newUser, newUser.authorityList
                            })*/
                        }}>
                            <option selected="selected" value="">--</option>
                            <option value={Roles.TEST}>{Roles.TEST}</option>
                            <option value={Roles.USER}>{Roles.USER}</option>

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
        </div>
    )
}

export default UserDashboard;
