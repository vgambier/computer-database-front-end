import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';
import {I18nProvider} from "./i18n";
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import {authorityToJSON, displayAuthorityOption1,displayAuthorityOption2, displayEnabledOption } from './AuthorityHelper';


function User(props) {

    const [user, setUser] = useState(props.user);
    const [editMode, setEditMode] = useState(false);
    const {username,enabled,authorityList} = user;

    const authorities = ["ROLE_ADMIN","ROLE_USER","ROLE_TEST"];
    const state= ["0","1"];


    return (
        <I18nProvider locale={props.locale}>

            {!editMode ?
                <>
                    <td> {username} </td>
                    <td> {enabled} </td>
                    <td> {authorityList[0]} </td>
                    <td> {authorityList[1]} </td>
                    <td>
                        <Button className="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit" height="28" width="25"/></Button>
                        <Button className="button" onClick={() => props.delete(username)}><img src={deletes} alt="delete" height="28" width="25"/></Button>
                    </td>
                </>
                :
                <>
                    <td><Input defaultValue={username} onChange={elt => setUser({...user, username: elt.target.value})}/></td>

                    <td><select onChange={elt => setUser({...user, enabled: elt.target.value})}>
                        {state.map(elt => displayEnabledOption({enabled}, elt))}
                    </select></td>

                    <td><select onChange={elt => setUser({...user, authorityList: authorityToJSON(elt.target.value)})}>
                        {authorities.map(elt => displayAuthorityOption1({authorityList}, elt))}
                    </select></td>
                    <td><select onChange={elt => setUser({...user, authorityList: authorityToJSON(elt.target.value)})}>
                        {authorities.map(elt => displayAuthorityOption2({authorityList}, elt))}
                    </select></td>

                    <td>
                        <Button className="button3" onClick={() => {
                            setEditMode(!editMode);
                            props.edit(user);
                        }}>Confirms</Button>
                    </td>
                </>
            }
        </I18nProvider>
    );
}

export default User;
