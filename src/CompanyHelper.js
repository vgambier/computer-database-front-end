import React from "react";

export function printCompany(company) {
    return company.company !== null ? company.company.name : "";
}

export function companyToJSON(company) {

    if (company === "") {
        return {id: null, name: null};
    } else {
        return JSON.parse(company);
    }
}

export function displayCompanyOption(companyObject, elt) {

    const jsonString = getCompanyJsonString(elt);

    if (companyObject.company && elt.id === companyObject.company.id) {
        return (
            <option value={jsonString} key={elt.id}> {elt.name} </option>
        )
    } else {
        return (
            <option value={jsonString} key={elt.id}> {elt.name} </option>
        )
    }
}

export function getCompanyJsonString(elt) {
    return '{"id":"' + elt.id + '","name":"' + elt.name + '"}';
}