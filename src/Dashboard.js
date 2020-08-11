import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import {SERVER_INFO} from './server_info';
import useAxios from "axios-hooks";
import Computer from "./Computer";

export const server_url = "http://"+SERVER_INFO.ip_address +":" +SERVER_INFO.port+"/"+SERVER_INFO.app_name;

function Dashboard() {

    // Setting page title
    useEffect(() => {
        document.title = "Computer Database"
    }, []);

    const [{ data }] = useAxios(`${server_url}/computers/page/1`); // Connecting to the server (back-end)
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    const [{ company_data }] = useAxios(`${server_url}/companies`); // Connecting to the server (back-end)
    const [companies, setCompanies] = useState(company_data); // Grabbing data from the dataset

    // HTML Add, Delete, Edit requests

    const [{ data: dataAdd }, executeAdd] = useAxios({
        url: `${server_url}/computers`,
        method: "POST"
    }, { manual: true });

    const [{ }, executeDelete] = useAxios({
        url: `${server_url}/computers`,
        method: "DELETE"
    }, { manual: true });

    const [{ data: dataEdit }, executeEdit] = useAxios({
        url: `${server_url}/computers`,
        method: "PUT"
    }, { manual: true });

    useEffect(() => setComputers(data), [data, dataAdd, dataEdit]);
    useEffect(() => setCompanies(company_data), [company_data]);


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
                            computer => <Computer computer={computer} companies={companies} edit={editComputer}/>
                        )}
                    </tr>
                </tbody>

            </table>



        </div>
  );
}
export default Dashboard;
