import {Button, Col, Form, Row} from "react-bootstrap";
import LogicTable from "../logicTable";
import React from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";


const AddAlgoritms = (props) => {
    return (
        <div>
            <Form.Label>{props.title}</Form.Label>
        </div>
    )
}

export default AddAlgoritms;