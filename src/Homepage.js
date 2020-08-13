import React, {useEffect} from "react";
import {SERVER_INFO} from "./server_info";
import Authentication from "./Authentication";

export const server_url = "http://" + SERVER_INFO.ip_address + ":" + SERVER_INFO.port + "/" + SERVER_INFO.app_name;

function Homepage() {

    // Setting page title
    useEffect(() => {
        document.title = "Welcome!"
    }, []);

    return (

        <div className="Homepage">
            <Authentication/>
        </div>

    );
}

export default Homepage;