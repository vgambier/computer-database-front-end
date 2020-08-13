import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Button} from 'reactstrap';
import home from './images/home.jpg'

function Dashboard() {

    // Setting page title
    useEffect(() => {
        document.title = "Computer Database"
    }, []);

    // HTTP requests

    // Get all computers
    const [{data}] = useAxios(`${server_url}/computers/page/1`);
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    // Get all companies
    const [{company_data}] = useAxios(`${server_url}/companies`);
    const [companies, setCompanies] = useState(company_data); // Grabbing data from the dataset

    // Add one computer
    const [{data: dataAdd}, executeAdd] = useAxios({
        url: `${server_url}/computers`,
        method: "POST"
    }, {manual: true});

    // Delete one computer
    const [{}, executeDelete] = useAxios(
        {
            method: "DELETE"
        }
        , {manual: true});

    // Edit one computer
    const [{data: dataEdit}, executeEdit] = useAxios({
        url: `${server_url}/computers`,
        method: "PUT"
    }, {manual: true});

    useEffect(() => setComputers(data), [data, dataAdd, dataEdit]);
    useEffect(() => setCompanies(company_data), [company_data]);

    // Editing logic
    function editComputer(updatedComputer) {
        executeEdit({data: updatedComputer});
        computers.push(updatedComputer);
    }

    function deleteComputer(id) {
        executeDelete({url: `${server_url}/computers/${id}`})
        setComputers(computers.filter(computer => computer.id !== id))
    }

    return (
        <body>
            <div id="page1">
                <div id="navigation">

                    <p align="center">

                        <div id="center">
                            <a href="home.html"><img src={home} alt="Application de bases de données d’ordinateurs" width="320"/></a><br/>
                            <i> COMPUTER DATABASE,</i><br/>
                            <p>Application of computer databases</p>
                        </div>

                    </p>

                    <div id="vertical-menu">

                        <li><a href="home.html">Home</a></li>

                        <li><a href="dashboard.html" className="active">Dashboard</a></li>

                    </div>
                </div>
                <div id="main-page">
                    <div className="content">
                        <footer>
                            <ul className="horizontal-menu">
                                <li>partie logout</li>
                            </ul>
                        </footer>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default Dashboard;
