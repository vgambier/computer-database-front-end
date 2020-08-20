import React, {useState} from 'react';
import {I18nProvider} from "./i18n";
import './Computer.css';
import deletes from "./images/corbeille.png";
import Modal from 'react-modal';
import translate from "./i18n/messages/translate";

function Company(props) {
    const [company] = useState(props.company);
    const {id, name} = company;

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

    // Deletion modal

    let subtitle;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    function afterOpenDeleteModal() {
        // references are now synchronized and can be accessed.
        subtitle.style.color = '#ff0000';
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
    }

    function confirm(id) {
        props.delete(id);
        props.set(props.count - 1);
    }

    return (
        <I18nProvider locale={props.locale}>

            <td> {id} </td>
            <td> {name} </td>
            <td>
                <button className="button" onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}><img src={deletes} alt="delete" height="28" width="25"/></button>

                <Modal
                    isOpen={isDeleteModalOpen}
                    onAfterOpen={afterOpenDeleteModal}
                    onRequestClose={closeDeleteModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2>{translate("Delete_company")}</h2>
                    <h3 ref={_subtitle => (subtitle = _subtitle)}>You are about to delete a company and all associated computers! Do you want to continue?</h3>
                    <button onClick={() => closeDeleteModal()}>Cancel</button>
                    <button onClick={() => closeDeleteModal() & confirm(id)}>Delete</button>
                </Modal>
            </td>
        </I18nProvider>
    );
}

export default Company;
