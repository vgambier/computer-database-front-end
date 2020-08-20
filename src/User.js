import React, {useState} from 'react';
import {Button} from 'reactstrap';
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import {authorityToJSON, displayAuthorityOption, displayEnabledOption} from './AuthorityHelper';
import translate from "./i18n/messages/translate";
import Modal from "react-modal";

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
    

    let subtitle;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    function afterOpenDeleteModal() {
        // references are now synchronized and can be accessed.
        subtitle.style.color = '#ff0000';
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
    }


    return (
        <>
            {!editMode ?
                <>
                    <td> {username} </td>
                    <td> {enabled} </td>
                    <td> {authorities[(maxAuthority(user))]} </td>
                    <td> {minAuthority(user)} </td>
                    <td>
                        <Button className="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit"
                                                                                               height="28" width="25"/></Button>
                        <Button className="button" onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}><img src={deletes}
                                                                                               alt="delete" height="28"
                                                                                               width="25"/></Button>

                        <Modal
                            isOpen={isDeleteModalOpen}
                            onAfterOpen={afterOpenDeleteModal}
                            onRequestClose={closeDeleteModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <h2>{translate("Delete")}</h2>
                            <h3 ref={_subtitle => (subtitle = _subtitle)}>{translate("Delete confirm")}</h3>
                            <button onClick={() => closeDeleteModal()}>{translate("Cancel")}</button>
                            <button onClick={() => closeDeleteModal() & props.delete(username)}>{translate("Confirm")}</button>
                        </Modal>
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
        </>
    );
}

export default User;
