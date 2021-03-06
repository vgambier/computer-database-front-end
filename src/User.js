import React, {useState} from 'react';
import {Button} from 'reactstrap';
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import translate from "./i18n/messages/translate";
import Modal from "react-modal";
import {AvField, AvForm} from "availity-reactstrap-validation";

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
    const {username, enabled, authorityList} = user;

    const authorities = ["ROLE_TEST", "ROLE_USER", "ROLE_ADMIN"];
    const state = ["0", "1"];


    function minAuthority(user) {
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

    // Edition modal

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    function closeEditModal() {
        setIsEditModalOpen(false);
    }


    let subtitle;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    function afterOpenDeleteModal() {
        // references are now synchronized and can be accessed.
        subtitle.style.color = '#ff0000';
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
    }

    const Authorities = {
        ADMIN: "ROLE_ADMIN",
        USER: "ROLE_USER",
        TEST: "ROLE_TEST",
    }


    return (
        <>
            <>
                <td> {username} </td>
                <td> {enabled} </td>
                <td> {authorities[(maxAuthority(user))]} </td>
                <td> {minAuthority(user)} </td>
                <td>
                    <Button className="button" onClick={() => setIsEditModalOpen(!isEditModalOpen)}><img src={edit}
                                                                                                         alt="edit"
                                                                                                         height="28"
                                                                                                         width="25"/></Button>
                    <Button className="button" onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}><img
                        src={deletes}
                        alt="delete" height="28"
                        width="25"/></Button>

                    <Modal
                        isOpen={isDeleteModalOpen}
                        onAfterOpen={afterOpenDeleteModal}
                        onRequestClose={closeDeleteModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <h3>{translate("Delete user")}</h3>
                        <h3 ref={_subtitle => (subtitle = _subtitle)}>{translate("User confirm")}</h3>
                        <button className="button3"
                                onClick={() => closeDeleteModal() & props.delete(username)}>{translate("Confirm")}</button>
                        <button className="button" onClick={() => closeDeleteModal()}>{translate("Cancel")}</button>

                    </Modal>

                    <Modal
                        isOpen={isEditModalOpen}
                        onRequestClose={closeEditModal}
                        style={customStyles}
                        contentLabel="Edit User"
                    >

                        <h3>{translate("Edit user")}</h3>
                        {translate("Username")} :<h6><i>{username}</i></h6>
                        <AvForm>
                            <AvField name="state" label={translate("State")} type="select" defaultValue={enabled}
                                     onChange={elt => setUser({...user, enabled: elt.target.value})}>
                                <option value={state[0]}>{state[0]}</option>
                                <option value={state[1]}>{state[1]}</option>

                            </AvField>

                            <AvField
                                name="authority" type="select" defaultValue={authorities[(maxAuthority(user))]}
                                label={translate("Authority")}
                                onChange={elt => setUser({...user, authorityList: [elt.target.value]})}>
                                }>

                                <option value={Authorities.USER}>{Authorities.USER}</option>
                                <option value={Authorities.ADMIN}>{Authorities.ADMIN}</option>

                            </AvField>
                            <br/>
                            <AvField
                                name="secondary" label={translate("Secondary")} type="select" defaultValue={minAuthority(user)}
                                onChange={elt => {
                                    user.authorityList.push(elt.target.value);

                                }}>
                                <option selected="selected" value="">--</option>
                                <option value={Authorities.USER}>{Authorities.USER}</option>
                            </AvField><br/>
                            <br/>
                            <Button className="button3" onClick={() => {
                                closeEditModal()
                                props.edit(user);
                            }}>{translate("Confirm")}</Button>
                            <Button className="button" onClick={() => closeEditModal()}>{translate("Cancel")}</Button>
                        </AvForm>

                    </Modal>
                </td>
            </>
            <>

            </>
        </>
    );
}

export default User;
