import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Container, ListGroup, Form, Button} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";

const UserList = () => {
    let Delete= (<Form.Check
        type="checkbox"
        id="Delete-check"
      />);
    let Permission= (<Form.Check
        type="switch"
        id="Permission-switch"
      />);
    let BirthDate= (<Form.Group controlId="dob">
        <Form.Control style={{width:200, textAlign:"center"}} type="date" name="dob" placeholder="Date of Birth" />
    </Form.Group>);
    return (
        <div className="App">
            <h1>Users</h1>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>

                <Link to="/Users/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable data={[["","User Id","Last Name", "First Name","Date of Birth", "Admin Permissions"], [Delete,"001","Vandenbroeke", "Stein", BirthDate, Permission], [Delete, "003","Van den Broeck", "Niels", BirthDate, Permission]]}/>
        </div>
    );
};

export default UserList;