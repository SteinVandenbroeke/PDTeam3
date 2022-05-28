import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Col, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import AbtestLoading from "../components/AbtestLoading";

const Welcome = () => {
    const [image, setImage] = useState("data:image/png;base64,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")

    return (
        <div className="App">
            <header>
                <h1>Welcome to this great site!</h1>
            </header>
            <AbtestLoading></AbtestLoading>
            <img src={image} alt={"AB Test image"} width={"450"}/>

        </div>
    );
};

export default Welcome;
