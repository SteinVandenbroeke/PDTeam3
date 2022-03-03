import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Login from "./Login";
import NavbarComp from "../components/Navbar";
import {Link, Outlet, Route, Router} from "react-router-dom";
import Page2 from "./Page2";

const Dashboard = () => {
    return (
        <div className="App">
            <header>
                <Container fluid>
                  <Row>
                    <Col md="auto">
                        <Container style={{paddingTop: 20, paddingBottom: 30}}>
                            <Card className={"shadow"} style={{padding: 30}}>
                                <ListGroup variant="flush">
                                  <ListGroup.Item action ><Link to="/dashboard/abTests" class={"btn"}>A/B tests</Link></ListGroup.Item>
                                  <ListGroup.Item action ><Link to="/dashboard/dataSets" class={"btn"}>Mijn datasets</Link></ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Container>
                    </Col>
                    <Col style={{paddingTop: 10, paddingRight: 30}}>
                        <Card style={{padding: 30}}>
                            <Outlet/>
                        </Card>
                    </Col>
                  </Row>
                </Container>
            </header>
        </div>
    );
};

export default Dashboard;
