import React, {useState} from "react";
import {Button} from "react-bootstrap";

const Accordion = (props) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="accordion shadow" style={{maxWidth: props.width}}>
            <div className="accordion-item">
                <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
                    <div className="accordion-title-text" style={{flex: 1, padding: 6}}>{props.title}</div>
                    {!isActive && <Button style={{width: 40, height: 40}}>+</Button>}
                    {isActive && <Button style={{width: 40, height: 40}}>-</Button>}
                </div>
                {isActive && <div className="accordion-content">{props.data}</div>}
            </div>
        </div>
    )
}

Accordion.defaultProps = {
    title: "A title",
    data: "Some data in the Accordion",
    width: 900,
    align: "center"
}



export default Accordion;