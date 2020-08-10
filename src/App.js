import React, {useEffect, useState} from 'react';
import './App.css';
import {SERVER_INFO} from './server_info';
import useAxios from "axios-hooks";
import Computer from "./Computer";

export const server_url = "http://"+SERVER_INFO.ip_address +":" +SERVER_INFO.port+"/"+SERVER_INFO.app_name;

function App() {

    const [{ data }] = useAxios(`${server_url}/computers/page/1`); // Connecting to the server (back-end)
    const [computers, setComputers] = useState(data); // Grabbing data from the dataset

    useEffect(() => setComputers(data), [data]);

    return (

        <div className="App">

            Welcome to CDB!

            <table>
                <thead>
                    <tr>
                        <th class="editMode">
                            <input type="checkbox" id="selectall" />
                            <span>
                                -
                                <a href="#" id="deleteSelected" onclick="$.fn.deleteSelected();">
                                    <i class="fa fa-trash-o fa-lg"></i>
							    </a>
						</span></th>

                        <th>Name</th>
                        <th>Introduced</th>
                        <th>Discontinued</th>
                        <th>Company</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {computers && computers.map( // We need to check that computers is not undefined because of asynchronicity
                            computer => <Computer computer={computer}/>
                        )}
                    </tr>
                </tbody>

            </table>



        </div>
  );
}

export default App;
