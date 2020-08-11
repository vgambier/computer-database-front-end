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

    function companyToJSON(string) {
        // TODO
        // menu déroulant
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

                    <select>

                        {companies && companies.map(elt => (

                            <option value="company" >
                                {elt.name}
                            </option>

                        ))}

                    </select>


                    <Input defaultValue = {printCompany({company})} onChange={elt => setComputer({ ...computer, company: {id: 0, name:""}})} />
                    <Button onClick={() => { setEditMode(!editMode); props.edit(computer) }}>Confirm</Button>
                </>
            }
        </div>
    );
}
export default Computer;