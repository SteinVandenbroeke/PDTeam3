import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Container, ListGroup, Form, Button,Col,Row} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";

const AddUsers = () => {
    let date = new Date();
    const maxDateValue = date.toISOString().split("T")[0];  // convert to ISO string
    return (
        <div className="App">
            <Container>
              <Row>
                <Col xs={12} md={6}>
                    <h1>Add new user</h1>
                    <Form style={{textAlign:"left"}}>
                        <Container>
                            <Row>
                                <Col style={{padding:10}}>
                                    <Form.Control type="name" placeholder="Last name"/>
                                </Col>
                                <Col style={{padding:10}}>
                                    <Form.Control type="name" placeholder="First name" />
                                </Col>
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="username" placeholder="Username" />
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="password" placeholder="Password" />
                            </Row>
                            <Row style={{padding:10}}>
                           <Col>
                               <Form.Label>Date of Birth</Form.Label>
                               <Form.Control style={{ textAlign:"center"}} max={maxDateValue} type="date" name="dob" placeholder="Date of Birth"/>
                            </Col>
                            <Col>
                                <Form.Label>Admin Permission</Form.Label>
                                <Form.Check/>
                            </Col>

                            </Row>
                            <Row style={{padding:10}}>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Row>
                        </Container>
                    </Form>
                </Col>
                <Col xs={12} md={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={"/svg/NewUser.svg"} style={{width: "90%"}} xs={0}/>
                </Col>
              </Row>
            </Container>

        </div>
    );
};

export default AddUsers;