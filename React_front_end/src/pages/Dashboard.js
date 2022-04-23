import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Login from "./Login";
import NavbarComp from "../components/Navbar";
import {Link, Outlet, Route, Router} from "react-router-dom";
import Page2 from "./Page2";
import Icon from 'react-eva-icons';

const Dashboard = () => {
    let [showMenu , setShowMenu] = useState(true);

    return (
        <div className="App">
            <header>
                <Container fluid>
                  <Row>
                    <Col md="auto">
                        <Container style={{paddingTop:10, paddingBottom: 30}}>
                            <Card className={"shadow-lg"} style={{padding: 30}}>
                                <Button style={{position: "absolute", left: 5, top: 5}} variant="" onClick={()=>setShowMenu(!showMenu)}>
                                    <Icon
                                    fill="#000"
                                    name="menu-outline"
                                    size="medium"
                                    />
                                </Button>
                                {showMenu &&
                                <ListGroup variant="flush" style={{marginTop: 20}}>
                                    <ListGroup.Item action ><Link to="/dashboard/abTests" class={"btn"}>A/B tests</Link></ListGroup.Item>
                                    <ListGroup.Item action ><Link to="/dashboard/dataSets" class={"btn"}>Mijn datasets</Link></ListGroup.Item>
                                </ListGroup>}
                            </Card>
                        </Container>
                    </Col>
                    <Col style={{paddingTop: 10, paddingRight: 30}}>
                        <Card className={"shadow"} style={{padding: 30}}>
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
