import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useContext, useEffect, useState} from 'react';
import {Col, Row, Button, Form, Container, Spinner} from "react-bootstrap";
import {userSession} from "../App"
import {User} from "../logic/User";
import { toast } from 'react-toastify';


const Login = () => {
    let usersession = useContext(userSession);
    const [loading, setLoading] = useState(false);

    function userLogin(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        setLoading(true);

        usersession.user.login(formData).then(() => window.location.reload())
            .catch(error => toast.error(error.message))
            .finally(()=>setLoading(false));
    }

    return (
        <div className="App">
            <header>
                <Container fluid="md">
                    <Row>
                        <Col xs={12} sm={12} md={5} style={{padding: 40}} >
                            <h1>Login</h1>
                            <Form style={{padding: 10}} onSubmit={(event) => userLogin(event)}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" name="email"  />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" name="password"  />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    {!loading? "Login ": "Inloggen "}
                                    <Spinner
                                            className={!loading? "visually-hidden": ""}
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                </Button>
                            </Form>
                        </Col>
                        <Col xs={0} sm={0} md={7}>
                            <img src={"/svg/login.svg"} style={{width: "90%"}} xs={0}/>
                        </Col>
                    </Row>
                </Container>
            </header>
        </div>
    );
};

export default Login;
