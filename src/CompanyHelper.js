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

export function getCompanyJsonString(elt) {
    return '{"id":"' + elt.id + '","name":"' + elt.name + '"}';
}