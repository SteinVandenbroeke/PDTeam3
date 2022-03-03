import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useContext, useEffect} from 'react';
import {Col, Row, Button, Form, Container} from "react-bootstrap";
import {userSession} from "../App"
import User from "../logic/User";

const Login = () => {
    let usersession = useContext(userSession);
    useEffect(() => {
        console.log(usersession);
    });

    function userLogin(){
        usersession.user.login("test", "test").then(() => {
            window.location.reload();
        });
    }

    return (
        <div className="App">
            <header>
                <Container fluid="md">
                    <Row>
                        <Col xs={12} sm={12} md={5} style={{padding: 40}} >
                            <h1>Login</h1>
                            <Form style={{padding: 10}}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <Button variant="primary" onClick={() => {userLogin()}}>
                                    Login
                                </Button>
                            </Form>
                        </Col>
                        <Col xs={0} sm={0} md={7}>
                            <img src={"svg/login.svg"} style={{width: "90%"}} xs={0}/>
                        </Col>
                    </Row>
                </Container>
            </header>
        </div>
    );
};

export default Login;
