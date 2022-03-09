import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Container, ListGroup, Form, Button,Col,Row} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";

const AddUsers = () => {
    return (
        <div className="App">
            <Container>
              <Row>
                <Col xs={6} md={4}>
                </Col>
                <Col xs={6} md={4}>
                    <h1>Add new user</h1>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Control type="name" placeholder="name" />
                </Col>
                <Col xs={6} md={4}>
                </Col>
              </Row>

            </Container>

        </div>
    );
};

export default AddUsers;