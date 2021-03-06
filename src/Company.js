import React, {useState} from 'react';
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

        <>
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
                    <h3>{translate("Delete_company")}</h3>
                    <h3 ref={_subtitle => (subtitle = _subtitle)}>{translate("Delete confirm")}</h3>
                    <button className="button3" onClick={() => closeDeleteModal() & confirm(id)}>{translate("Confirm")}</button>
                    <button className="button" onClick={() => closeDeleteModal()}>Cancel</button>
                </Modal>
            </td>
        </>
    );
}

export default Company;
