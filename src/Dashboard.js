import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Input} from "reactstrap";
import {companyToJSON, getCompanyJsonString} from "./CompanyHelper";
import {I18nProvider, LOCALES} from "./i18n";
import translate from "./i18n/messages/translate";

function Dashboard() {

    let result;

    function editSearch(string) {
        result = string;
    }

    // HTTP requests

    // For i18n
    const [locale, setLocale] = useState(LOCALES.ENGLISH);

    // For pagination
    const [page, setPage] = useState(1);
    const [nbEntries, setNbEntries] = useState(25);
    const [orderBy, setOrderBy] = useState("computer.id");
    const [search, setSearch] = useState("");

    // Count computers
    const [{data: computersCount}] = useAxios(`${server_url}/computers/count`);

    // Count companies
    const [{data: companiesCount}] = useAxios(`${server_url}/companies/count`);

    // Get all computers
    const [{data}] = useAxios(`${server_url}/computers/page/` + page + `/` + nbEntries + `/` + orderBy + `/` + search);
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    // Get all companies

    const [{data: company_data}] = useAxios(`${server_url}/companies`);
    const [companies, setCompanies] = useState(company_data);

    // Add one computer
    const [{}, executeAdd] = useAxios({
        url: `${server_url}/computers`,
        method: "POST"
    }, {manual: true});

    // Delete one computer
    const [{}, executeDelete] = useAxios({
        method: "DELETE"
    }, {manual: true});

    // Edit one computer
    const [{}, executeEdit] = useAxios({
        url: `${server_url}/computers`,
        method: "PUT"
    }, {manual: true});

    // Adding logic
    const [addMode, setAddMode] = useState(false);
    const [newComputer, setNewComputer] = useState({
        name: "",
        introduced: "",
        discontinued: "",
        company: {id: null, name: null}
    });

    function addComputer() {
        setAddMode(!addMode);
        executeAdd({data: newComputer}).then(
            response => {
                console.log(response);
                setNewComputer({...newComputer, id: response.data});
                setComputers(computers => [...computers, newComputer]);
            });
    }

    // Editing logic
    function editComputer(updatedComputer) {

const indexOfEntryOfId = computers.map(computer => computer.id).indexOf(updatedComputer.id);
        executeEdit({data: updatedComputer}).then(() => {
            const newComputers = [...computers];
            newComputers[indexOfEntryOfId]=updatedComputer;
            setComputers(newComputers);
        });
    }
    // Deleting logic
    function deleteComputer(id) {
        executeDelete({url: `${server_url}/computers/${id}`}).then(() => {
            const newComputers = computers.filter(computer => computer.id !== id);
            setComputers(newComputers);
        });
    }

    function countPages() {
        if (computersCount % nbEntries === 0) {
            return computersCount / nbEntries;
        } else {
            return (Math.floor(computersCount / nbEntries)) + 1;
        }
    }

    // Use effects

    useEffect(() => setComputers(data), [data]);
    useEffect(() => setCompanies(company_data), [company_data]);
    useEffect(() => setPage(page), [page]);
    useEffect(() => setNbEntries(nbEntries), [nbEntries]);
    useEffect(() => setNewComputer(newComputer), [newComputer]);
    useEffect(() => setOrderBy(orderBy), [orderBy]);
    useEffect(() => setSearch(search), [search]);


    return (
        <div id="body1">

            <I18nProvider locale={locale}>
                <p className="Messages">
                    <h1> {computersCount} {translate("Computers")} {translate("blabla")}</h1>
                    <h1> {translate("Welcome")} {translate("CDB")}</h1>
                </p>
                <div className="Dashboard">

                    <button className="button" onClick={() => setLocale(LOCALES.ENGLISH)}>English</button>
                    <button className="button" onClick={() => setLocale(LOCALES.FRENCH)}>Français</button>

                            <p>
                            <button onClick={() => setNbEntries(10) & setPage(1)}>10</button>
                            <button onClick={() => setNbEntries(25) & setPage(1)}>25</button>
                            <button onClick={() => setNbEntries(50) & setPage(1)}>50</button>
                            </p>

                             <p>
                            <button className="button2" onClick={() => setOrderBy("computer.id") & setPage(1)}>Computer Id</button>
                            <button className="button2" onClick={() => setOrderBy("computer.name") & setPage(1)}>{translate("Name")}</button>
                            <button className="button2" onClick={() => setOrderBy("introduced") & setPage(1)}>{translate("Introduced")}</button>
                            <button className="button2" onClick={() => setOrderBy("discontinued") & setPage(1)}>{translate("Discontinued")}</button>
                            <button className="button2" onClick={() => setOrderBy("computer.company.name") & setPage(1)}>{translate("Company")}
                            </button>
                             </p>

                            <div>
                            <Input placeholder={"CDB"} onChange={elt => editSearch(elt.target.value)}/>
                            <button className="button2" onClick={() => setSearch(result) & setPage(1)}>OK</button>
                            </div>
                    <div>
                        <Input placeholder={"CDB"} onChange={elt => editSearch(elt.target.value)}/>
                        <button className="button2" onClick={() => setSearch(result) & setPage(1)}>OK</button>
                    </div>

                    <button className="button" onClick={() => setPage(1)}>{translate("First Page")}</button>
                    <button className="button"
                            onClick={() => setPage(Math.max(1, page - 1))}>{translate("Previous Page")}</button>
                    <button className="button4">{page}</button>
                    <button className="button"
                            onClick={() => setPage(Math.min(/*countPages()*/100, page + 1))}>{translate("Next Page")}</button>
                    <button className="button"
                            onClick={() => setPage(countPages())}>{translate("Last Page")}</button>
                    <p></p>

                    <table>
                        <thead>
                        <tr>
                            <th class="editMode">
                                {/* <input type="checkbox" id="selectall"/>
                                <span>
                                <a href="#" id="deleteSelected" onclick="$.fn.deleteSelected();">
                                    <i class="fa fa-trash-o fa-lg"></i>
							    </a>
						            </span>*/}</th>

                                    <th>{translate("Name")}</th>
                                    <th>{translate("Introduced")}</th>
                                    <th>{translate("Discontinued")}</th>
                                    <th>{translate("Company")}</th>
                                </tr>
                                </thead>
                                <button className="button" onClick={() => setPage(1)}>{translate("First Page")}</button>
                                <button className="button" onClick={() => setPage(Math.max(1,page - 1))}>{translate("Previous Page")}</button>
                                <button className="button" >{page}</button>
                                <button className="button" onClick={() => setPage(Math.min(countPages(),page + 1))}>{translate("Next Page")}</button>
                                <button className="button" onClick={() => setPage(countPages())}>{translate("Last Page")}</button>

                        <tbody>
                        <tr>
                            {computers && companies &&  computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                                computer => {
                                            return (<Computer key={computer.id} computer={computer}
                                                      companies={companies} delete={deleteComputer}
                                                      edit={editComputer} locale={locale}/>
                            )})}
                        </tr>

                        {!addMode ?

                            <button class="button3" onClick={() => setAddMode(!addMode)}>{translate("Add")}</button>

                            :

                            <>
                                <Input placeholder="Fancy Computer #15"
                                       onChange={elt => setNewComputer({
                                                   ...newComputer,
                                                   name: elt.target.value
                                })}/><Input placeholder="2001-12-31"
                                       onChange={elt => setNewComputer({
                                                   ...newComputer,
                                                   introduced: elt.target.value
                                })}/><Input placeholder="2011-12-31"
                                       onChange={elt => setNewComputer({
                                                   ...newComputer,
                                                   discontinued: elt.target.value
                                               })}/>

                                <select onChange={elt => setNewComputer({...newComputer, company: companyToJSON(elt.target.value)})}>
                                    <option value="">--</option>
                                    {companies && companies.map(elt =>
                                        <option key={elt.id}value={getCompanyJsonString(elt)}> {elt.name} </option>)}
                                </select>

                                <button onClick={() => addComputer()}>Confirm</button>
                            </>
                        }

                        </tbody>

                    </table>

                </div>
            </I18nProvider>
        </div>
    );
}

export default Dashboard;
