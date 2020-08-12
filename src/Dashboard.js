import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Button} from 'reactstrap';

import { I18nProvider, LOCALES} from "./i18n";
import translate  from "./i18n/messages/translate";
function Dashboard() {

    // Setting page title
    useEffect(() => {
        document.title = "Computer Database";
    }, []);
    // HTTP requests


    // Get all computers
    const [{ data }] = useAxios(`${server_url}/computers/page/1`);
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    // Get all companies
    const [{ data: company_data }] = useAxios(`${server_url}/companies`);
    const [companies, setCompanies] = useState(company_data); // Grabbing data from the dataset

    // Add one computer
    const [{ data: dataAdd }, executeAdd] = useAxios({
        url: `${server_url}/computers`,
        method: "POST"
    }, { manual: true });

    // Delete one computer
    const [{ }, executeDelete] = useAxios(
        {
        method: "DELETE"
        }
    , { manual: true });

    // Edit one computer
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

    function deleteComputer(id){
        executeDelete({url :`${server_url}/computers/${id}`})
        setComputers(computers.filter(computer => computer.id !== id))
    }

    // For i18n
    const [locale, setLocale]= useState(LOCALES.ENGLISH);
    useEffect(() => setLocale(locale), [locale]);

    return (
        <I18nProvider locale={locale}>
        <div className="Dashboard">
            <h1>Welcome to {translate("CDB")}!</h1>
            <button onClick={()=> setLocale(LOCALES.ENGLISH)}>English</button>
            <button onClick={()=> setLocale(LOCALES.FRENCH)}>French</button>

            <table>
                <thead>
                    <tr>
                        <th class="editMode">
                            <input type="checkbox" id="selectall" />
                            <span>
                                <a href="#" id="deleteSelected" onclick="$.fn.deleteSelected();">
                                    <i class="fa fa-trash-o fa-lg"></i>
							    </a>
						</span></th>

                        <th>{translate("Name")}</th>
                        <th>{translate("Introduced")}</th>
                        <th>{translate("Discontinued")}</th>
                        <th>{translate("Company")}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {computers && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                            computer => <Computer key={computer.id} computer={computer} companies={companies} delete={deleteComputer} edit={editComputer} locale={locale}/>
                        )}
                    </tr>
                </tbody>

            </table>

        </div>
        </I18nProvider>
  );
}
export default Dashboard;
