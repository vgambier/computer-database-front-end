import React from "react";


export function authorityToJSON(authorityList) {

    if (authorityList === "") {
        return {authorityList: null};
    } else {
        return JSON.parse(authorityList);
    }
}

export function displayAuthorityOption(authorityList, elt) {

    if (authorityList && elt === authorityList[0]) {
        return (
            <option selected="selected" value={elt}> {elt} </option>
        )
    } else {
        return (
            <option value={elt}> {elt} </option>
        )
    }
}




export function displayEnabledOption(enabled, elt) {

    if (elt === enabled) {
        return (
            <option selected="selected" value={elt}> {elt} </option>
        )
    } else {
        return (
            <option value={elt}> {elt} </option>
        )
    }
}

