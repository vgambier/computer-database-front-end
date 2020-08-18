import React from "react";

export function printAuthority(authorityList) {
    return authorityList[0] !== null ? authorityList[0] : "";
}

export function authorityToJSON(authorityList) {

    if (authorityList === "") {
        return {authorityList: null};
    } else {
        return JSON.parse(authorityList);
    }
}

export function displayAuthorityOption1(authorityList, elt) {

    if (authorityList && elt === authorityList[0]) {
        return (
            <option selected="selected" value={elt} > {elt} </option>
        )
    } else {
        return (
            <option value={elt}> {elt} </option>
        )
    }
}

export function displayAuthorityOption2(authorityList, elt) {

    if (authorityList && elt === authorityList[1]) {
        return (
            <option selected="selected" value={elt} > {elt} </option>
        )
    } else {
        return (
            <option value={elt}> {elt} </option>
        )
    }
}

export function displayEnabledOption(enabled, elt) {

    if (enabled && elt === enabled) {
        return (
            <option selected="selected" value={elt} > {elt} </option>
        )
    } else {
        return (
            <option value={elt}> {elt} </option>
        )
    }
}

/*export function getAuthorityJsonString(elt) {
    return '{"authority":"' + elt.authorityList[0] + '"}';
}*/
