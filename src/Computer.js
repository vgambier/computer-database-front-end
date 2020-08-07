import React, {useState} from 'react';

function Computer(props) {

    const [computer, setComputer] = useState(props.computer);
    const {id, name, introduced, discontinued, company} = computer;

    return (

        <div className="Computer">
            {name}
        </div>

    );

}
export default Computer;