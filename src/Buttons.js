import './Dashboard.css';
import translate from "./i18n/messages/translate";
import React from "react";
import {I18nProvider} from "./i18n";
import rightArrow from "./images/rightArrow.png";
import leftArrow from "./images/leftArrow.png";
import first from "./images/previous.png";
import last from "./images/next.png";

function Buttons(props) {


    if (props.page === 1) {
        return (
                <div>
                    <button className="button4">{props.page}</button>
                    &nbsp;
                    <button className="button"
                            onClick={() => props.setPage(Math.min(props.countPages(), props.page + 1))}><h9> {translate("Next Page")} <img alt="right arrow" src={rightArrow} width="20"/></h9></button>
                    &nbsp;
                    <button className="button"
                            onClick={() => props.setPage(props.countPages())}> <h9> {translate("Last Page")} <img alt="double right arrow" src={last} width="20"/></h9></button>
                    &nbsp;
                </div>
        )
    } else {
        if (props.page === props.countPages()) {
            return (
                <I18nProvider locale={props.locale}>
                    <div>
                        <button className="button" onClick={() => props.setPage(1)}><img alt="double left arrow" src={first} width="20"/><h9> {translate("First Page")}</h9></button>
                        &nbsp;
                        <button className="button"
                                onClick={() => props.setPage(Math.max(1, props.page - 1))}><img alt="left arrow" src={leftArrow} width="20"/><h9> {translate("Previous Page")}</h9></button>
                        &nbsp;
                        <button className="button4"><h9>{props.page}</h9></button>
                        &nbsp;
                    </div>
                </I18nProvider>

            )
        } else {
            return (
                <I18nProvider locale={props.locale}>
                    <div>
                        <button className="button" onClick={() => props.setPage(1)}><h9>  {translate("First Page")} </h9><img alt="double left arrow" src={first} width="20"/></button>
                        <button className="button"
                                onClick={() => props.setPage(Math.max(1, props.page - 1))}><h9>  {translate("Previous Page")}</h9> <img alt="left arrow" src={leftArrow} width="20"/></button>
                        <button className="button4">{props.page}</button>
                        <button className="button"
                                onClick={() => props.setPage(Math.min(props.countPages(), props.page + 1))}><img alt="right arrow" src={rightArrow} width="20"/><h9> {translate("Next Page")}</h9></button>
                        <button className="button"
                                onClick={() => props.setPage(props.countPages())}><img alt="double right arrow" src={last} width="20"/><h9> {translate("Last Page")}</h9></button>
                    </div>
                </I18nProvider>
            )
        }
    }
}

export default Buttons;

