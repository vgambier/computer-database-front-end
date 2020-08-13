import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import home from './images/home.jpg'
import {Input} from "reactstrap";
import {companyToJSON, getCompanyJsonString} from "./CompanyHelper";
import { I18nProvider, LOCALES} from "./i18n";
import translate  from "./i18n/messages/translate";

function Dashboard() {

    // Setting page title
    useEffect(() => {
        document.title = "Computer Database";
    }, []);

    // HTTP requests

    // For i18n
    const [locale, setLocale]= useState(LOCALES.ENGLISH);

    // For pagination
    const [page, setPage]= useState(1);
    const [entries, setEntries]= useState(25);

    // Count computers
    const [{data: computersCount}] = useAxios(`${server_url}/computers/count`);

    // Count companies
    const [{data: companiesCount}] = useAxios(`${server_url}/companies/count`);

    // Get all computers
    const [{ data }] = useAxios(`${server_url}/computers/page/`+page+`/`+entries);
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    // Get all companies
    const [{ data: company_data }] = useAxios(`${server_url}/companies`);
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
        }, {manual: true});

    // Edit one computer
    const [{data: dataEdit}, executeEdit] = useAxios({
        url: `${server_url}/computers`,
        method: "PUT"
    }, {manual: true});

    useEffect(() => setComputers(data), [data, dataAdd, dataEdit]);
    useEffect(() => setCompanies(company_data), [company_data]);
    useEffect(() => setPage(page), [page]);
    useEffect(() => setEntries(entries), [entries]);


    // Adding logic
    const [addMode, setAddMode] = useState(false);
    const newComputer = {name: "", introduced:"", discontinued: "", company: {id: 0, name: ""}};
    function handleSubmit() {
        setAddMode(!addMode);
        executeAdd({ data: newComputer }).then(
            response => { computers.push({ ...newComputer, id: response.data }) });
        setComputers(computers);
    }

    // Editing logic
    function editComputer(updatedComputer) {
        executeEdit({data: updatedComputer});
        computers.push(updatedComputer);
    }


    // Deleting logic
    function deleteComputer(id){
        executeDelete({url :`${server_url}/computers/${id}`})
        setComputers(computers.filter(computer => computer.id !== id))
    }


    function countPages() {

        if(computersCount%entries===0) {
            return computersCount/entries;
        }
        else {
            console.log((Math.floor(computersCount/entries))+1);
            return (Math.floor(computersCount/entries))+1;
        }
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

                        <I18nProvider locale={locale}>
                            <div className="Dashboard">
                                <h1> {translate("Welcome")} {translate("CDB")}</h1>
                                <h2> {computersCount} {translate("Computers")} {translate("blabla")}</h2>
            <button onClick={()=> setLocale(LOCALES.ENGLISH)}>English</button>
                                <button onClick={()=> setLocale(LOCALES.FRENCH)}>French</button>
            <button onClick={()=> setEntries(10) & setPage(1)}>10</button>
            <button onClick={()=> setEntries(25) & setPage(1)}>25</button>
            <button onClick={()=> setEntries(50) & setPage(1)}>50</button>

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
                                    <button onClick={()=> setPage(1)}>{translate("First Page")}</button>
                                    <button onClick={()=> setPage(page-1)}>{translate("Previous Page")}</button>
                                    <button onClick={()=> setPage(page+1)}>{translate("Next Page")}</button>
                                    <button onClick={()=> setPage(countPages())}>{translate("Last Page")}</button>

                                    <tbody>
                                    <tr>
                                        {computers && companies && computers && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                                            computer => <Computer key={computer.id} computer={computer} companies={companies} delete={deleteComputer} edit={editComputer} locale={locale}/>

                                        )}
                                    </tr>

                                    {!addMode ?

                                        <button onClick={() => setAddMode(!addMode)}>{translate("Add")}</button>

                                        :

                                        <>
                                            <Input placeholder="Fancy Computer #15" onChange={elt => newComputer.name = elt.target.value} />
                                            <Input placeholder="2001-12-31" onChange={elt => newComputer.introduced = elt.target.value} />
                                            <Input placeholder="2011-12-31" onChange={elt => newComputer.discontinued = elt.target.value} />

                                            <select onChange={elt => newComputer.company = companyToJSON(elt.target.value)}>
                                                <option value="">--</option>
                                                {companies && companies.map(elt => <option value={getCompanyJsonString(elt)}> {elt.name} </option>)}
                                            </select>

                                            <button onClick={() => handleSubmit()}>Confirm</button>
                                        </>
                                    }

                                    </tbody>

                                </table>

                            </div>
                        </I18nProvider>

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
