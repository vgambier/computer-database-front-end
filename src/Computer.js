import React, {useState} from 'react';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const {id, name, introduced, discontinued, company} = computer;

    function printIntroduced(date) {
        return date.introduced != undefined ? date.introduced.dayOfMonth+"-"+date.introduced.month+"-"+date.introduced.year : "";
    }
    function printDiscontinued(date) {
        return date.discontinued != undefined ? date.discontinued.dayOfMonth+"-"+date.discontinued.month+"-"+date.discontinued.year : "";
    }
    function printCompany(company) {
        return company.company != undefined ? company.company.name : "";
    }

    return (

        <div className="Computer">

            <td className="editMode"> <input type="checkbox" name="cb" className="cb" value={id}/> </td>
            <td> {name} </td>
            <td> {printIntroduced({introduced})} </td>
            <td> {printDiscontinued({discontinued})} </td>
            <td> {printCompany({company})} </td>

        </div>

    );

}
export default Computer;