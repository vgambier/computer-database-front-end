import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Table, Input} from "reactstrap";
import {companyToJSON, getCompanyJsonString} from "./CompanyHelper";
import {I18nProvider, LOCALES} from "./i18n";
import translate from "./i18n/messages/translate";

function Dashboard() {

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
        id: "",
        name: "",
        introduced: "",
        discontinued: "",
        company: {id: null, name: null}
    });

    function addComputer() {
        setAddMode(!addMode);
        executeAdd({data: newComputer}).then(
            response => {
                newComputer.id=response.data.toString();
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
          console.log(id);
        executeDelete({url: `${server_url}/computers/${id}`}).then(() => {
            const newComputers = computers.filter(computer => computer.id !== id);
            setComputers(newComputers);
        });
    }

    // Count pages logic
    function countPages() {
        if (computersCount % nbEntries === 0) {
            return computersCount / nbEntries;
        } else {
            return (Math.floor(computersCount / nbEntries)) + 1;
        }
    }

    // Search logic

    const [result, setResult] = useState("");
    function editSearch(string) {
        setResult(string);
    }

    // Use effects

    useEffect(() => setComputers(data), [data]);
    useEffect(() => setCompanies(company_data), [company_data]);
    useEffect(() => setPage(page), [page]);
    useEffect(() => setNewComputer(newComputer), [newComputer]);
    useEffect(() => setNbEntries(nbEntries), [nbEntries]);
    useEffect(() => setOrderBy(orderBy), [orderBy]);
    useEffect(() => setSearch(search), [search]);


    return (
        <div id="body1">

                    <I18nProvider locale={locale}>
                        <div className="Dashboard">

                            <h2> {computersCount} {translate("Computers")} {translate("blabla")}</h2>
                            <button onClick={() => setLocale(LOCALES.ENGLISH)}>English</button>
                            <button onClick={() => setLocale(LOCALES.FRENCH)}>French</button>
                            <br/>

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

                            <div id="searchbar">
                                <Input placeholder={"CDB"} onChange={elt => editSearch(elt.target.value)}/>
                                <button className="button2" onClick={() => setSearch(result) & setPage(1)}>OK</button>
                            </div>
                            <br/>
                            <button className="button" onClick={() => setPage(1)}>{translate("First Page")}</button>
                            <button className="button"
                                    onClick={() => setPage(Math.max(1, page - 1))}>{translate("Previous Page")}</button>
                            <button className="button4">{page}</button>
                            <button className="button"
                                    onClick={() => setPage(Math.min(/*countPages()*/100, page + 1))}>{translate("Next Page")}</button>
                            <button className="button"
                                    onClick={() => setPage(countPages())}>{translate("Last Page")}</button>
                            <br/>
                            <button onClick={() => setEntries(10) & setPage(1)}>10</button>
                            <button onClick={() => setEntries(25) & setPage(1)}>25</button>
                            <button onClick={() => setEntries(50) & setPage(1)}>50</button>
                            <br/>
                            <button onClick={() => setOrderBy("computer.id") & setPage(1)}>Computer Id</button>
                            <button onClick={() => setOrderBy("computer.name") & setPage(1)}>{translate("Name")}</button>
                            <button onClick={() => setOrderBy("introduced") & setPage(1)}>{translate("Introduced")}</button>
                            <button onClick={() => setOrderBy("discontinued") & setPage(1)}>{translate("Discontinued")}</button>
                            <button onClick={() => setOrderBy("computer.company.name") & setPage(1)}>{translate("Company")}
                            </button>
                             </p>

                            <div id="table">
                    <div>
                        <Input placeholder={"CDB"} onChange={elt => editSearch(elt.target.value)}/>
                        <button className="button2" onClick={() => setSearch(result) & setPage(1)}>OK</button>
                    </div>

                            <Table>

                                <thead>
                                <tr>
                                    <td className="editMode">
                                        <input type="checkbox" id="selectall"/>
                                        <span>
                                        <a href="#" id="deleteSelected" onClick="$.fn.deleteSelected();">
                                            <i className="fa fa-trash-o fa-lg"></i>
							            </a>
                                    </span>
                                    </td>
                                    <td>{translate("Name")}</td>
                                    <td>{translate("Introduced")}</td>
                                    <td>{translate("Discontinued")}</td>
                                    <td>{translate("Company")}</td>
                                </tr>
                                </thead>

                                <tbody>

                                    {computers && companies && computers && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                                        computer =>    <tr>< Computer key={computer.id}
                                                              computer={computer}
                                                              companies={companies}
                                                              delete={deleteComputer}
                                                              edit={editComputer}
                                                              locale={locale}/></tr>
                                    )}

                        </tbody>

                    </Table>

                            </div>

                            </div>

                        </I18nProvider>
                </div>
    );
}

export default Dashboard;
