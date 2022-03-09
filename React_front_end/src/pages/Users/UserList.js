import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Container, ListGroup, Form, Button,Spinner} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";

const UserList = () => {

    let Delete= (<Button variant="outline-danger">
        <Icon
            fill="#dc3545"
            name="trash-2-outline"
        /></Button>);
    let Permission= (<Form.Check
        type="switch"
        id="Permission-switch"
    />);
    let BirthDate= (<Form.Group style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} controlId="dob">
        <Form.Control style={{width:200}} type="date" name="dob" placeholder="Date of Birth" />
    </Form.Group>);
    let UserData= [["001","Vandenbroeke", "Stein","Steen", BirthDate, Permission,Delete],["003","Van den Broeck", "Niels","NielsBroecky", BirthDate, Permission,Delete]]
    let TableData= [["User Id","Last Name", "First Name","Username","Date of Birth", "Admin Permissions",""]].concat(UserData)
    return (
        <div className="App">
            <h1>Users</h1>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/Users/add" class={"btn"}>
                    <Button variant="primary">Add new user <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable data={TableData}/>
        </div>
    );
};

export default UserList;