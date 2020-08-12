import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const [companies] = useState(props.companies);
    const [editMode, setEditMode] = useState(false);
    const {id, name, introduced, discontinued, company} = computer;

    // TODO: remove this
    function printDate(date) {
        return date !== null && date != "" ? date.dayOfMonth + "-" + date.month + "-" + date.year : "";
    }

    function printCompany(company) {
        return company.company !== null ? company.company.name : "";
    }

    function companyToJSON(company) {

        if (company == "") {
            return {id: 0, name: ""};
        } else {
            return JSON.parse(company)
        }
    }

    function displayCompanyOption(elt) {
        const jsonString = '{"id":' + elt.id + ',"name":"' + elt.name + '"}';

        if ({company}.company && elt.id == {company}.company.id) {
            return (
                <option selected="selected" value={jsonString}> {elt.name} </option>
            )
        } else {
            return (
                <option value={jsonString}> {elt.name} </option>
            )
        }
    }

    return (

        <div className="Computer">

            {!editMode ?

                <>
                    <td className="deleteMode">
                        <input type="checkbox" name="cb" className="cb" value={id}/>
                    </td>
                    <td> {name} </td>
                    <td> {printDate({introduced}.introduced)} </td>
                    <td> {printDate({discontinued}.discontinued)} </td>
                    <td> {printCompany({company})} </td>
                    <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
                </>
                :
                <>
                    <Input defaultValue={name} onChange={elt => setComputer({...computer, name: elt.target.value})}/>
                    <Input defaultValue={printDate({introduced}.introduced)}
                           onChange={elt => setComputer({...computer, introduced: elt.target.value})}/>
                    <Input defaultValue={printDate({discontinued}.discontinued)}
                           onChange={elt => setComputer({...computer, discontinued: elt.target.value})}/>

                    <select onChange={elt => setComputer({...computer, company: companyToJSON(elt.target.value)})}>
                        <option value="">--</option>
                        {companies && companies.map(elt => displayCompanyOption(elt))}
                    </select>

                    <Button onClick={() => {
                        setEditMode(!editMode);
                        props.edit(computer)
                    }}>Confirm</Button>
                </>
            }
        </div>
    );
}

export default Computer;