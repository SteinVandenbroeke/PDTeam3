import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Container, ListGroup, Form, Button} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link, Outlet} from "react-router-dom";
import Icon from "react-eva-icons";
import BackButton from "../../components/backButton";

const Users = () => {
    let Permission= (<Form.Check
        type="switch"
        id="custom-switch"
      />);
    let BirthDate= (<Form.Group controlId="dob">
        <Form.Control style={{width:200, textAlign:"center"}} type="date" name="dob" placeholder="Date of Birth" />
    </Form.Group>);
    return (
        <div className="App">
            <header>
                        <Container style={{paddingTop: 20, paddingBottom: 30}}>
                            <Card className={"shadow-lg"} style={{padding: 30}}>
                                <BackButton/>
                                <Outlet/>
                            </Card>
                        </Container>
            </header>
        </div>
    );
};

export default Users;
