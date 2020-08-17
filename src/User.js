import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';
import {I18nProvider} from "./i18n";
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";

function User(props) {

    const [user, setUser] = useState(props.user);
    const [editMode, setEditMode] = useState(false);
    const {username,enabled,authorityList} = user;


    return (
        <I18nProvider locale={props.locale}>

            {!editMode ?
                <>
                    <td> {username} </td>
                    <td> {enabled} </td>
                    <td> {authorityList} </td>
                    <td>
                        <Button className="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit" height="28" width="25"/></Button>
                        <Button className="button" onClick={() => props.delete(username)}><img src={deletes} alt="delete" height="28" width="25"/></Button>
                    </td>
                </>
                :
                <>
                    <td><Input defaultValue={username} onChange={elt => setUser({...user, username: elt.target.value})}/></td>
                    <td><Input defaultValue={enabled}
                               onChange={elt => setUser({...user, authorityList: elt.target.value})}/></td>
                    <td><select onChange={elt => setUser({...user, enabled: elt.target.value})}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                    </select></td>

                    <td>
                        <Button className="button" onClick={() => {
                            setEditMode(!editMode);
                            props.edit(user);
                        }}>Confirm</Button>
                    </td>
                </>
            }
        </I18nProvider>
    );
}

export default User;
