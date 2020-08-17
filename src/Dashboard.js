import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Table, Input, Label, Form, FormGroup} from "reactstrap";
import {companyToJSON, getCompanyJsonString} from "./CompanyHelper";
import {I18nProvider, LOCALES} from "./i18n";
import translate from "./i18n/messages/translate";
import Buttons from "./Buttons"

function Dashboard() {

    // For i18n
    const [locale, setLocale] = useState(LOCALES.ENGLISH);

    // For pagination
    const [page, setPage] = useState(1);
    const [nbEntries, setNbEntries] = useState(25);
    const [orderBy, setOrderBy] = useState("computer.id");
    const [search, setSearch] = useState("");

    /* HTTP requests */

    // Count computers
    const [{data: count_data}] = useAxios(`${server_url}/computers/count`/*, {useCache: false}*/);
    const [computersCount, setComputersCount] = useState(count_data);
    // Count companies
    const [{data: companiesCount}] = useAxios(`${server_url}/companies/count`);

    // Get all computers
    const [{data}, executeRefresh] = useAxios(
        `${server_url}/computers/page/` + page + `/` + nbEntries + `/` + orderBy + `/` + search,
        {useCache: false});
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

    /* End of HTTP requests */

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
                newComputer.id = response.data.toString();
                setComputers(computers => [...computers, newComputer]);
            });
    }

    // Editing logic
    function editComputer(updatedComputer) {

        const indexOfEntryOfId = computers.map(computer => computer.id).indexOf(updatedComputer.id);
        executeEdit({data: updatedComputer}).then(() => {
            const newComputers = [...computers];
            newComputers[indexOfEntryOfId] = updatedComputer;
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
    useEffect(() => setComputersCount(count_data), [count_data]);


    return (
        <div id="body1">

            <I18nProvider locale={locale}>
                <div className="Dashboard">

                    <h2> {computersCount} {translate("Computers")} {translate("inside_db")}</h2>
                    <button onClick={() => setLocale(LOCALES.ENGLISH)}>English</button>
                    <button onClick={() => setLocale(LOCALES.FRENCH)}>French</button>
                    <br/>

                    {!addMode ?

                        <button className="button3"
                                onClick={() => setAddMode(!addMode)}>{translate("Add")}</button>

                        :

                        <Form>
                            <FormGroup>
                                <Label>{translate("Name")}</Label>
                                <Input placeholder="Fancy Computer #15"
                                       onChange={elt => setNewComputer(
                                           {
                                               ...newComputer,
                                               name: elt.target.value
                                           })}/>
                            </FormGroup>

                            <FormGroup>
                                <Label>{translate("Introduced")}</Label><Input type="datetime"
                                                                               placeholder="2001-12-31"
                                                                               onChange={elt => setNewComputer(
                                                                                   {
                                                                                       ...newComputer,
                                                                                       introduced: elt.target.value
                                                                                   }
                                                                               )}/>
                            </FormGroup>

                            <FormGroup>
                                <Label>{translate("Discontinued")}</Label>
                                <Input type="datetime" placeholder="2011-12-31" onChange={elt => setNewComputer(
                                    {...newComputer, discontinued: elt.target.value}
                                )}/>
                            </FormGroup>

                            <FormGroup>
                                <Label>{translate("Company")}</Label>
                                <select onChange={elt => setNewComputer({
                                    ...newComputer,
                                    company: companyToJSON(elt.target.value)
                                })}>
                                    <option value="">--</option>
                                    {companies && companies.map(elt =>
                                        <option key={elt.id}
                                                value={getCompanyJsonString(elt)}> {elt.name} </option>)}
                                </select>
                            </FormGroup>

                            <button
                                onClick={() => addComputer() & setComputersCount(computersCount + 1) & setPage(countPages())}>Confirm
                            </button>

                        </Form>
                    }

                    <div id="searchbar">
                        <Label>{translate("Search")}</Label>
                        <Input placeholder="Powerbook" onChange={elt => editSearch(elt.target.value)}/>
                        <button className="button2" onClick={() => setSearch(result) & setPage(1)}>OK</button>
                    </div>
                    <br/>
                    <Buttons page={page} countPages={countPages} setPage={setPage} locale={locale}/>
                    <br/>
                    <button onClick={() => setNbEntries(10) & setPage(1)}>10</button>
                    <button onClick={() => setNbEntries(25) & setPage(1)}>25</button>
                    <button onClick={() => setNbEntries(50) & setPage(1)}>50</button>
                    <br/>

                    <br/>

                    <div id="table">

                        <Table>

                            <thead>
                            <tr>
                                <td>
                                    <button
                                        onClick={() => setOrderBy("computer.id") & setPage(1)}>{translate("Id")}</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setOrderBy("computer.name") & setPage(1)}>{translate("Name")}</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setOrderBy("introduced") & setPage(1)}>{translate("Introduced")}</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setOrderBy("discontinued") & setPage(1)}>{translate("Discontinued")}</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setOrderBy("computer.company.name") & setPage(1)}>{translate("Company")}</button>
                                </td>
                                <td>{translate("Actions")}</td>
                            </tr>
                            </thead>

                            <tbody>

                            {computers && companies && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                                computer => <tr key={computer.id}>
                                    <Computer
                                        computer={computer}
                                        companies={companies}
                                        delete={deleteComputer}
                                        edit={editComputer}
                                        locale={locale}
                                        count={computersCount}
                                        set={setComputersCount}
                                    /></tr>
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
