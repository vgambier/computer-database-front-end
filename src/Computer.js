import React, {useState} from 'react';
import { Button, Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const [companies] = useState(props.companies);
    const [editMode, setEditMode] = useState(false);
    const {id, name, introduced, discontinued, company} = computer;

    // Dropdown logic
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    function printDate(date) {
        return date !== null ? date.dayOfMonth+"-"+date.month+"-"+date.year : "";
    }

    function printCompany(company) {
        return company.company !== null ? company.company.name : "";
    }

    function dateToJSON(string) {

        // TODO if null send "", otherwise send well-formated JSON

        if (true) {
            return "";
        }
        else {
            const date = new Date(string);
            const jsonDate = {"year": date.getFullYear(), "month": date.getMonth()+1, "dayOfMonth": date.getUTCDate()};
            return jsonDate;
        }
    }

    function companyToJSON(company) {

        console.log(company);

        const jsonCompany = JSON.parse(company)
        // TODO
        console.log(jsonCompany);

        return jsonCompany;

        if (company.company_id !== null && company.company_name !== null) {
            return {id:company.company_id, name:company.company_name}
        }
        else {
            return {id: 0, name:""};
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
                    <Input defaultValue = {name} onChange={elt => setComputer({ ...computer, name: elt.target.value })} />
                    <Input defaultValue = {printDate({introduced}.introduced)} onChange={elt => setComputer({ ...computer, introduced: dateToJSON(elt.target.value) })} />
                    <Input defaultValue = {printDate({discontinued}.discontinued)} onChange={elt => setComputer({ ...computer, discontinued: dateToJSON(elt.target.value) })} />

                    Company

                    <select onChange={elt => setComputer({ ...computer, company: companyToJSON(elt.target.value) })} >

                        {companies && companies.map(elt => {

                            const magic = '{"id":' + elt.id + ',"name":"'+elt.name+'"}';

                            return (
                                    <option value={magic}>
                                        {elt.name}
                                    </option>
                                )

                            }

                        )}

                    </select>

                    <Button onClick={() => { setEditMode(!editMode); props.edit(computer) }}>Confirm</Button>
                </>
            }
        </div>
    );
}
export default Computer;