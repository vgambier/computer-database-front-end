import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';
import {I18nProvider} from "./i18n";
import translate from "./i18n/messages/translate";
import {printCompany, companyToJSON, displayCompanyOption} from './CompanyHelper';
import './Computer.css';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const [companies] = useState(props.companies);
    const [editMode, setEditMode] = useState(false);
    const {id, name, introduced, discontinued, company} = computer;

    return (
        <I18nProvider locale={props.locale}>

            <td> {id} </td>
            {!editMode ?
                <>
                    <td> {name} </td>
                    <td> {introduced} </td>
                    <td> {discontinued} </td>
                    <td> {printCompany({company})} </td>
                    <td><Button className="button" onClick={() => props.delete(id)}>{translate('Delete')}</Button></td>
                    <td><Button className="button" onClick={() => setEditMode(!editMode)}>{translate('Edit')}</Button></td>
                </>
                :
                <>
                    <td><Input defaultValue={name} onChange={elt => setComputer({...computer, name: elt.target.value})}/></td>
                    <td><Input defaultValue={introduced}
                               onChange={elt => setComputer({...computer, introduced: elt.target.value})}/></td>
                    <td><Input defaultValue={discontinued}
                               onChange={elt => setComputer({...computer, discontinued: elt.target.value})}/></td>
                    <td><select onChange={elt => setComputer({...computer, company: companyToJSON(elt.target.value)})}>
                        <option value="">--</option>
                        {companies && companies.map(elt => displayCompanyOption({company}, elt))}
                    </select></td>

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
