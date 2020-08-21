import React, {useState} from 'react';
import {Button} from 'reactstrap';
import {I18nProvider} from "./i18n";
import {printCompany, companyToJSON, getCompanyJsonString} from './CompanyHelper';
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import Modal from 'react-modal';
import {AvForm, AvField} from 'availity-reactstrap-validation';
import translate from "./i18n/messages/translate";

function Computer(props) {
    const [computer, setComputer] = useState(props.computer);
    const [updatedComputer, setUpdatedComputer] = useState(computer);
    const [companies] = useState(props.companies);
    const {id, name, introduced, discontinued, company} = computer;

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

    function handleValidEdit() {
        props.edit(computer.id, updatedComputer);
        setComputer(updatedComputer);
        closeEditModal();
    }

    function handleInvalidEdit(event, errors, values) {
        console.log("Invalid form submission");
        console.log(event);
        console.log(errors);
        console.log(values);
    }

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
            <td> {introduced} </td>
            <td> {discontinued} </td>
            <td> {printCompany({company})} </td>
            <td>
                <Button className="button" onClick={() => setIsEditModalOpen(!isEditModalOpen)}><img src={edit} alt="edit" height="28" width="25"/></Button>
                <button className="button" onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}><img src={deletes} alt="delete" height="28" width="25"/></button>

                <Modal
                    isOpen={isDeleteModalOpen}
                    onAfterOpen={afterOpenDeleteModal}
                    onRequestClose={closeDeleteModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2>{translate("Delete")}</h2>
                    <h3 ref={_subtitle => (subtitle = _subtitle)}>You are about to delete a computer! Do you want to continue?</h3>
                    <button onClick={() => closeDeleteModal() & confirm(id)}>{translate("Confirm")}</button>
                    <button onClick={() => closeDeleteModal()}>{translate("Cancel")}</button>
                </Modal>

                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    style={customStyles}
                    contentLabel="Edit Computer"
                >
                    <h2>{translate("Edit")}</h2>

                    <AvForm onValidSubmit={handleValidEdit} onInvalidSubmit={handleInvalidEdit}>

                        <AvField class="form" name="name" label={translate("Name")} type="text" defaultValue={name}
                                 validate={{
                                     required: {value: true, errorMessage: 'This field is required'},
                                     maxlength: {value: 100, errorMessage: 'Names must be fewer than 100 characters'}
                                 }}
                                 placeholder="Fancy Computer #15"
                                 onChange={elt => setUpdatedComputer({...updatedComputer, name: elt.target.value})}
                        />


                        <AvField name="introduced" label={translate("Introduced")} type="date" defaultValue={introduced}
                                 onChange={elt => setUpdatedComputer({...updatedComputer, introduced: elt.target.value})}
                        />

                        <AvField name="discontinued" label={translate("Discontinued")} type="date" defaultValue={discontinued}
                                 onChange={elt => setUpdatedComputer({...updatedComputer, discontinued: elt.target.value})}
                        />

                        <AvField name="company" label={translate("Company")} type="select"
                                 defaultValue={getCompanyJsonString(company)}
                                 onChange={elt => setUpdatedComputer({...updatedComputer, company: companyToJSON(elt.target.value)})}>
                            <option value="">--</option>

                            {companies && companies.map(elt =>
                                <option value={getCompanyJsonString(elt)} key={elt.id}> {elt.name} </option>)}
                        </AvField>

                        <Button className="button">{translate("Confirm")}</Button>
                        <Button className="button" onClick={() => closeEditModal()}>{translate("Cancel")}</Button>

                    </AvForm>

                </Modal>
            </td>
        </I18nProvider>
    );
}

export default Computer;
