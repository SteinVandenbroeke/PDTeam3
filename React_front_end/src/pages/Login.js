import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useContext, useEffect} from 'react';
import {Col, Row, Button, Form, Container} from "react-bootstrap";
import {userSession} from "../App"

const Login = () => {
    let usersession = useContext(userSession);
    useEffect(() => {
        //usersession.user.login("test", "test");
    });
    return (
        <div className="App">
            <header>
                <Container fluid="md">
                    <Row>
                        <Col xs={12} md={4} >
                            <h1>Login</h1>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col xs={0} md={6}>
                        </Col>
                    </Row>
                </Container>
            </header>
        </div>
    );
};

export default Login;
