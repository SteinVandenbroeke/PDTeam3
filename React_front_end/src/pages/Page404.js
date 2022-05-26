import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Icon from "react-eva-icons";
import {Link, Outlet} from "react-router-dom";
import BackButton from "../components/backButton";

const Page404 = () => {
    return (
        <div className="Page404">
            <header>
                <Container style={{paddingTop: 20, paddingBottom: 30}}>
                    <Card className={"shadow-lg"} style={{padding: 30}}>
                        <BackButton/>
                        <div style={{textAlign: "center", paddingTop: 40, zIndex: 1}}>
                            <img src={"/svg/serverDown.svg"}/>
                            <h1 style={{paddingTop: 40}}>Page not found (404)</h1>
                        </div>
                        <h1 style={{position: "absolute", right: "-5%", top: "12%", transform: "rotate(-90deg)", fontSize: "1000%", zIndex: 0, color:"#3472b510" }}>404</h1>
                    </Card>
                </Container>
            </header>
        </div>
    );
};

export default Page404;