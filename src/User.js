import React, {useState} from 'react';
import {Button} from 'reactstrap';
import {I18nProvider} from "./i18n";
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import {authorityToJSON, displayAuthorityOption, displayEnabledOption} from './AuthorityHelper';

const Roles = {
    ROLE_ADMIN: 2,
    ROLE_USER: 1,
    ROLE_TEST: 0,
};

function getValue(key) {
    return Roles[key];
}

export function maxAuthority(user) {
    let temp = user.authorityList.map(elt => getValue(elt));
    temp = Math.max.apply(Math, temp);
    return temp;
}

function User(props) {

    const [user, setUser] = useState(props.user);
    const [editMode, setEditMode] = useState(false);
    const {username, enabled, authorityList} = user;

    const authorities = ["ROLE_TEST", "ROLE_USER", "ROLE_ADMIN"];
    const state = ["0", "1"];


    function minAuthority(user) {
        console.log(user.username);
        console.log(user.authorityList.length);
        if (user.authorityList.length > 1) {
            if (getValue(user.authorityList[0]) === maxAuthority(user)) {
                return authorityList[1];
            } else {
                return authorityList[0];
            }
        } else return "";
    }


    return (
        <I18nProvider locale={props.locale}>

            {!editMode ?
                <>
                    <td> {username} </td>
                    <td> {enabled} </td>
                    <td> {authorities[(maxAuthority(user))]} </td>
                    <td> {minAuthority(user)} </td>
                    <td>
                        <Button className="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit"
                                                                                               height="28" width="25"/></Button>
                        <Button className="button" onClick={() => props.delete(username)}><img src={deletes}
                                                                                               alt="delete" height="28"
                                                                                               width="25"/></Button>
                    </td>
                </>
                :
                <>
                    <td>{username}</td>

                    <td><select onChange={elt => setUser({...user, enabled: elt.target.value})}>
                        {state.map(elt => displayEnabledOption({enabled}, elt))}
                    </select></td>

                    {/*<td><select onChange={elt => setUser({...user, authorityList: authorityToJSON(elt.target.value)})}>
                        {authorities.map(elt => displayAuthorityOption({authorityList}, elt))}
                    </select></td>
                    {<td><select onChange={elt => setUser({...user, authorityList: authorityToJSON(elt.target.value)})}>
                        <option selected="selected" >--</option>
                        {authorities.map(elt => displayAuthorityOption({authorityList}, elt))}
                    </select></td>}*/}

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
