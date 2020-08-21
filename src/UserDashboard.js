import './Dashboard.css';
import translate from "./i18n/messages/translate";
import React, {useEffect, useState} from "react";
import {Table} from "reactstrap";
import useAxios from "axios-hooks";
import {server_url} from "./Homepage";
import User from "./User";

function UserDashboard(props) {

    // Get all users
    const [{data}] = useAxios(
        `${server_url}/users/`,
        {useCache: false});
    const [users, setUsers] = useState(data); // Grabbing data from the dataset



    // Delete a user
    const [, executeDelete] = useAxios({
        method: "DELETE"
    }, {manual: true});

    // Edit user ROLES
    const [, executeEdit] = useAxios({
        url: `${server_url}/users`,
        method: "PUT"
    }, {manual: true});

    // ENABLE User
    const [, executeEnable] = useAxios({
        method: "POST"
    }, {manual: true});

    // DISABLE  User
    const [, executeDisable] = useAxios({
        url: `${server_url}/users/disable`,
        method: "POST"
    }, {manual: true});



    // Editing logic
    function editUser(updatedUser) {
        const indexOfEntryOfId = users.map(user => user.username).indexOf(updatedUser.username);
        executeEdit({data: updatedUser}).then(() => {
            const newUsers = [...users];
            newUsers[indexOfEntryOfId] = updatedUser;
            setUsers(newUsers);
        });

        if (updatedUser.enabled === "0") {
            executeDisable({url: `${server_url}/users/disable/` + updatedUser.username}).then(() => {
                const newUsers = [...users];
                newUsers[indexOfEntryOfId] = updatedUser;
                setUsers(newUsers);
            });

        } else {
            executeEnable({url: `${server_url}/users/enable/` + updatedUser.username}).then(() => {
                const newUsers = [...users];
                newUsers[indexOfEntryOfId] = updatedUser;
                setUsers(newUsers);
            });
        }
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


    return (
        <div>

            <div id="table">

                <Table>

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

                </Table>

            </div>
        </div>
    )
}

export default UserDashboard;
