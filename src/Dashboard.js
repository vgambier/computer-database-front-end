import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import Computer from "./Computer";
import {Table, Input, Label, Button} from "reactstrap";
import {companyToJSON, getCompanyJsonString} from "./CompanyHelper";
import {I18nProvider} from "./i18n";
import translate from "./i18n/messages/translate";
import Buttons from "./Buttons"
import {AvForm, AvField} from 'availity-reactstrap-validation';

function Dashboard(props) {


    // For pagination
    const [page, setPage] = useState(1);
    const [nbEntries, setNbEntries] = useState(25);
    const [orderBy, setOrderBy] = useState("computer.id");
    const [search, setSearch] = useState("");

    /* HTTP requests */

    // Count computers
    const [{data: count_data}] = useAxios(`${server_url}/computers/count`);
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

    const [dateMessage, setDateMessage] = useState("");

    function handleValidSubmit(event, values) {

        if (values.introduced && values.discontinued && new Date(values.introduced) >= new Date(values.discontinued)) {
            setDateMessage("Discontinued date must be after introduced date");
        } else {
            addComputer();
        }
    }

    function handleInvalidSubmit(event, errors, values) {
        console.log("Invalid form submission:");
        console.log(event);
        console.log(errors);
        console.log(values);
    }

    function addComputer() {
        setAddMode(!addMode);
        executeAdd({data: newComputer}).then(
            response => {
                newComputer.id = response.data.toString();
                setComputers(computers => [...computers, newComputer]);
                setComputersCount(computersCount + 1);
		        setPage(countPages());
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

        <I18nProvider locale={props.locale}>
            <div className="Dashboard">

                <Buttons page={page} countPages={countPages} setPage={setPage} locale={props.locale}/>
                <br/>

                <h2> {computersCount} {translate("Computers")} {translate("inside_db")}</h2>
                <br/>

                <div id="searchbar">
                    <Label>{translate("Search")}</Label>
                    <Input placeholder={"Powerbook..."} onChange={elt => editSearch(elt.target.value)}/>
                    <button className="button2" onClick={() => setSearch(result) & setPage(1)}><b>OK</b></button>
                </div>
                &nbsp;

                <div id="buttons">
                    <button onClick={() => setNbEntries(10) & setPage(1)}>10</button>
                    <button onClick={() => setNbEntries(25) & setPage(1)}>25</button>
                    <button onClick={() => setNbEntries(50) & setPage(1)}>50</button>
                    &nbsp;

                    {!addMode ?

                        <button className="button3"
                                onClick={() => setAddMode(!addMode)}><b>{translate("Add")}</b></button>

                        :

                        <AvForm onValidSubmit={handleValidSubmit} onInvalidSubmit={handleInvalidSubmit}>
                            <AvField name="name" label={translate("Name")} type="text"
                                     placeholder="Fancy Computer #15"
                                     onChange={elt => setNewComputer({...newComputer, name: elt.target.value})}
                                     validate={{
                                         required: {value: true, errorMessage: 'This field is required'},
                                         maxlength: {value: 100, errorMessage: 'Names must be fewer than 100 characters'}
                                     }}
                            />

                            <AvField name="introduced" label={translate("Introduced")} type="date"
                                     placeholder="2001-12-31"
                                     onChange={elt => setNewComputer({...newComputer, introduced: elt.target.value})}
                            />

                            <AvField name="discontinued" label={translate("Discontinued")} type="date"
                                     placeholder="2011-12-31"
                                     onChange={elt => setNewComputer({...newComputer, discontinued: elt.target.value})}
                            />
                            {dateMessage}

                            <AvField name="company" label={translate("Company")} type="select"
                                     onChange={elt => setNewComputer({
                                         ...newComputer, company: companyToJSON(elt.target.value)
                                     })}>
                                <option value="" selected="selected">--</option>
                                {companies && companies.map(elt =>
                                    <option key={elt.id}
                                            value={getCompanyJsonString(elt)}> {elt.name} </option>)}
                            </AvField>
                            <Button className="button">Confirm</Button>

                        </AvForm>
                    }

                </div>
                <br/> <br/>

                    <Table>

                        <thead>
                        <tr>

                            <td>
                                <button className="button6"
                                        onClick={() => setOrderBy("computer.id") & setPage(1)}>{translate("Id")}⬆⬇
                                </button>
                            </td>
                            <td>
                                <button className="button6"
                                        onClick={() => setOrderBy("computer.name") & setPage(1)}>{translate("Name")}⬆⬇
                                </button>
                            </td>
                            <td>
                                <button className="button6"
                                        onClick={() => setOrderBy("introduced") & setPage(1)}>{translate("Introduced")}⬆⬇
                                </button>
                            </td>
                            <td>
                                <button className="button6"
                                        onClick={() => setOrderBy("discontinued") & setPage(1)}>{translate("Discontinued")}⬆⬇
                                </button>
                            </td>
                            <td>
                                <button className="button6"
                                        onClick={() => setOrderBy("computer.company.name") & setPage(1)}>{translate("Company")}⬆⬇
                                </button>
                            </td>
                            <td><b>{translate("Actions")}</b></td>
                        </tr>
                        </thead>

                        <tbody>

                        {computers && companies && computers.map( // We need to check that `computers` is not undefined because of asynchronicity
                            computer =>
                                <tr key={computer.id}>
                                    <Computer
                                        computer={computer}
                                        companies={companies}
                                        delete={deleteComputer}
                                        edit={editComputer}
                                        locale={props.locale}
                                        count={computersCount}
                                        set={setComputersCount}
                                    />
                                </tr>
                        )}

                        </tbody>

                    </Table>

            </div>

        </I18nProvider>
    );
}

export default Dashboard;
