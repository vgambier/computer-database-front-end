import React, {useEffect, useState} from 'react';
import './App.css';
import {SERVER_INFO} from './server_info';
import useAxios from "axios-hooks";
import Computer from "./Computer";

export const server_url = "http://"+SERVER_INFO.ip_address +":" +SERVER_INFO.port+"/"+SERVER_INFO.app_name;

function App() {

    const [{ data }] = useAxios(`${server_url}/page/1`); // Connecting to the server (back-end)
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    useEffect(() => setComputers(data), [data]);

    return (

        <div className="App">

            Welcome to CDB! Here is a bunch of computers:

            {computers && computers.map( // We need to check that computers is not undefined because of asynchronicity
                computer => <Computer computer={computer}/>
            )}

        </div>
  );
}

export default App;
