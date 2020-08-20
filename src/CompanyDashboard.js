import './Dashboard.css';
import React, {useEffect, useState} from 'react';
import {server_url} from "./Homepage";
import useAxios from "axios-hooks";
import {Table} from "reactstrap";
import {I18nProvider} from "./i18n";
import translate from "./i18n/messages/translate";
import Company from "./Company";

function CompanyDashboard(props) {

    /* HTTP requests */

    // Count companies
    const [{data: company_count_data}] = useAxios(`${server_url}/companies/count`);
    const [companiesCount, setCompaniesCount] = useState(company_count_data);

    // Get all companies
    const [{data: company_data}] = useAxios(`${server_url}/companies`);
    const [companies, setCompanies] = useState(company_data);

    // Delete one company
    const [{}, executeDelete] = useAxios({
        method: "DELETE"
    }, {manual: true});

    /* End of HTTP requests */

    // Deleting logic
    function deleteCompany(id) {
        console.log(id);
        executeDelete({url: `${server_url}/companies/${id}`}).then(() => {
            const newCompanies = companies.filter(companies => companies.id !== id);
            setCompanies(newCompanies);
        });
    }

    // Use effects
    useEffect(() => setCompanies(company_data), [company_data]);
    useEffect(() => setCompaniesCount(company_count_data), [company_count_data]);

    return (

        <div className="CompanyDashboard">

            <br/>
            <h2> {companiesCount} {translate("companies")} {translate("inside_db")}</h2>
            <br/>
            <Table>

                <thead>
                <tr>

                    <td>
                        {translate("Id")}
                    </td>
                    <td>
                        {translate("Name")}
                    </td>
                    <td>
                        {translate("Actions")}
                    </td>

                </tr>
                </thead>

                <tbody>

                {companies && companies.map(
                    company =>
                        <tr key={company.id}>
                            <Company
                                company={company}
                                delete={deleteCompany}
                                locale={props.locale}
                                count={companiesCount}
                                set={setCompaniesCount}
                            />
                        </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}

export default CompanyDashboard;
