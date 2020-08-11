import React, {useState} from 'react';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const {id, name, introduced, discontinued, company} = computer;

    function printDate(date) {
        return date != undefined ? date.dayOfMonth+"-"+date.month+"-"+date.year : "";
    }

    function printCompany(company) {
        return company.company != undefined ? company.company.name : "";
    }

    return (

        <div className="Computer">

            <td className="editMode"> <input type="checkbox" name="cb" className="cb" value={id}/> </td>
            <td> {name} </td>
            <td> {printDate({introduced}.introduced)} </td>
            <td> {printDate({discontinued}.discontinued)} </td>
            <td> {printCompany({company})} </td>

        </div>

    );

}
export default Computer;