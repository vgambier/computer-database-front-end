import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';
import {I18nProvider} from "./i18n";
import {printCompany, companyToJSON, displayCompanyOption} from './CompanyHelper';
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.png";
import Modal from 'react-modal';


function Computer(props) {
    const [computer, setComputer] = useState(props.computer);
    const [companies] = useState(props.companies);
    const [editMode, setEditMode] = useState(false);
    const {id, name, introduced, discontinued, company} = computer;

    const customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
        }
    };



    let subtitle;
    const [modalIsOpen,setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#ff0000';
    }

    function closeModal(){
        setIsOpen(false);
    }

    function confirm(id)
    {
        props.delete(id);
        props.set(props.count-1);
    }



    return (
        <I18nProvider locale={props.locale}>


            <td> {id} </td>

            {!editMode ?
                <>
                    <td> {name} </td>
                    <td> {introduced} </td>
                    <td> {discontinued} </td>
                    <td> {printCompany({company})} </td>
                    <td>
                        <Button className="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit" height="28" width="25"/></Button>
                        <button className="button" onClick={() => setIsOpen(!modalIsOpen)}><img src={deletes} alt="delete" height="28" width="25"/></button>
                        <Modal
                            isOpen={modalIsOpen}
                            onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <h2 ref={_subtitle => (subtitle = _subtitle)}>You are about to delete a computer! Do you want to continue?</h2>
                            <button onClick={() => closeModal()}>CANCEL</button>
                            <button onClick={() => closeModal() & confirm(id)}>DELETE</button>
                            <div>I am a modal</div>
                            <form>
                                <input />
                                <button>WOW!</button>
                            </form>
                        </Modal>
                    </td>
                </>
                :
                <>
                    <td><Input defaultValue={name} onChange={elt => setComputer({...computer, name: elt.target.value})}/></td>
                    <td><Input type="datetime" defaultValue={introduced}
                               onChange={elt => setComputer({...computer, introduced: elt.target.value})}/></td>
                    <td><Input type="datetime" defaultValue={discontinued}
                               onChange={elt => setComputer({...computer, discontinued: elt.target.value})}/></td>
                    <td><select onChange={elt => setComputer({...computer, company: companyToJSON(elt.target.value)})}>
                        <option value="">--</option>
                        {companies && companies.map(elt => displayCompanyOption({company}, elt))}
                    </select></td>

                    <td>
                        <Button className="button" onClick={() => {
                            setEditMode(!editMode);
                            props.edit(computer);
                        }}>Confirm</Button>
                    </td>
                </>
            }
        </I18nProvider>
    );
}
export default Computer;
