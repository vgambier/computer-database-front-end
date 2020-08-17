import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';
import {I18nProvider} from "./i18n";
import translate from "./i18n/messages/translate";
import {printCompany, companyToJSON, displayCompanyOption} from './CompanyHelper';
import './Computer.css';
import deletes from "./images/corbeille.png";
import edit from "./images/edit.jpg";

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const [companies] = useState(props.companies);
    const [editMode, setEditMode] = useState(false);
    const {id, name, introduced, discontinued, company} = computer;

    return (
        <I18nProvider locale={props.locale}>

            {!editMode ?
                <>
                    {/*<td className="deleteMode">
                        <input type="checkbox" name="cb" className="cb" value={id}/>
                    </td>*/}
                    <td> {name} </td>
                    <td> {introduced} </td>
                    <td> {discontinued} </td>
                    <td> {printCompany({company})} </td>
                    <Button class="button" onClick={() => setEditMode(!editMode)}><img src={edit} alt="edit" height="22" width="25"/></Button>
                    <Button class="button" onClick={() => props.delete(id)}><img src={deletes} alt="delete" height="22" width="25"/></Button>
                </>
                :
                <>
                    <Input defaultValue={name} onChange={elt => setComputer({...computer, name: elt.target.value})}/>
                    <Input defaultValue={introduced}
                           onChange={elt => setComputer({...computer, introduced: elt.target.value})}/>
                    <Input defaultValue={discontinued}
                           onChange={elt => setComputer({...computer, discontinued: elt.target.value})}/>

                    <select onChange={elt => setComputer({...computer, company: companyToJSON(elt.target.value)})}>
                        <option value="">--</option>
                        {companies && companies.map(elt => displayCompanyOption({company}, elt))}
                    </select>

                    <Button onClick={() => {
                        setEditMode(!editMode);
                        props.edit(computer);
                    }}>Confirm</Button>
                </>
            }
        </I18nProvider>
    );
}

export default Computer;
