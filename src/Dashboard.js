import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Button} from 'reactstrap';

function Dashboard() {

    // Setting page title
    useEffect(() => {
        document.title = "Computer Database"
    }, []);


    // HTTP requests

    // Get all computers
    const [{ data }] = useAxios({
        url: `${server_url}/computers/page/1`
        //,  TODO      headers: {authorization: `Bearer ${token2}`}
    });

    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    // Get all companies
    const [{ data: company_data }] = useAxios({
        url: `${server_url}/companies`,
    });

    // Add one computer
    const [{ data: dataAdd }, executeAdd] = useAxios({
        url: `${server_url}/computers`,
        method: "POST"
    }, { manual: true });

    // Delete one computer
    const [{ }, executeDelete] = useAxios({
        url: `${server_url}/computers`,
        method: "DELETE"
    }, { manual: true });

    // Edit one computer
    const [{ data: dataEdit }, executeEdit] = useAxios({
        url: `${server_url}/computers`,
        method: "PUT"
    }, { manual: true });

    useEffect(() => setComputers(data), [data, dataAdd, dataEdit, company_data]);

    // Editing logic
    function editComputer(updatedComputer) {
        executeEdit({ data: updatedComputer });
        computers.push(updatedComputer);
    }

    return (

        <div className="Dashboard">
            Welcome to CDB!

            <table>
                <thead>
                    <tr>
                        <th class="editMode">
                            <input type="checkbox" id="selectall" />
                            <span>
                                -
                                <a href="#" id="deleteSelected" onclick="$.fn.deleteSelected();">
                                    <i class="fa fa-trash-o fa-lg"></i>
							    </a>
						</span></th>

                        <th>Name</th>
                        <th>Introduced</th>
                        <th>Discontinued</th>
                        <th>Company</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {computers && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                            computer => <Computer computer={computer} companies = {company_data} edit={editComputer}/>
                        )}
                    </tr>
                </tbody>

            </table>
        </div>
  );
}
export default Dashboard;
