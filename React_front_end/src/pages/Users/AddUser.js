import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Card, Container, ListGroup, Form, Button, Col, Row, Image, Spinner} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";
import ProfileImageMenu from "../../components/profileImageMenu";

import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from "react-toastify";
import {ServerRequest} from "../../logic/ServerCommunication";


const AddUsers = () => {
    const [formData, setFormData] = useState({firstName: "", image: null});
    const [loading, setLoading] = useState(false);

    async function registerUser(event){
        event.preventDefault()
        setLoading(true);
        const formData = new FormData(event.target);

        try{
            let request = new ServerRequest();
            let response = await request.sendPost("signup", formData);
            toast.success("User created");
            return true;
        }
        catch(err) {
             toast.error("Error: " + err);
        }
        finally {
            setLoading(false);
        }
    }

    let date = new Date();
    const maxDateValue = date.toISOString().split("T")[0];
    return (
        <div className="App">
            <Container>
              <Row>
                <Col xs={12} md={6}>
                    <h1>Add new user</h1>
                    <Form style={{textAlign:"left"}} onSubmit={(event) => registerUser(event)}>
                        <Container>
                            <Row>
                                <Col style={{padding:10}}>
                                    <Form.Control type="name" placeholder="Last name" name="lastName"/>
                                </Col>
                                <Col style={{padding:10}}>
                                    <Form.Control type="name" placeholder="First name" name="firstName" />
                                </Col>
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="username" placeholder="Username" name="userName" />
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="email" placeholder="Enter email" name="email" />
                            </Row>
                            <Row style={{padding:10}}>
                                <Form.Control type="password" placeholder="Password" name="password" />
                            </Row>
                            <Row style={{paddingBottom:10}}>
                                <Col>
                                   <Form.Label>Date of Birth</Form.Label>
                                   <Form.Control style={{ textAlign:"center"}} max={maxDateValue} type="date" name="dateOfBrith" placeholder="Date of Birth"/>
                                </Col>
                                <Col>
                                    <Form.Label>Admin Permission</Form.Label>
                                    <Form.Check name="adminPermision"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="ProfilePic" className="mb-3">
                                        <Form.Label >Add profile picture</Form.Label>
                                        <Form.Control name="profileImage" onChange={(e)=> setFormData({image: e.target.files[0]})} type="file" accept=".png,.jpg"/>
                                     </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Image roundedCircle={true} height={50} src={formData.image == null? "https://cdn.pixabay.com/photo/2017/11/10/05/24/select-2935439_960_720.png" : URL.createObjectURL(formData.image)}></Image>
                                </Col>
                            </Row>
                            <Row style={{padding:10}}>
                                <Button variant="primary" type="submit">
                                    {!loading? "Submit ": "Loading "}
                                    <Spinner
                                            className={!loading? "visually-hidden": ""}
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                </Button>
                            </Row>
                        </Container>
                    </Form>
                </Col>
                <Col xs={12} md={6} style={{display: 'flex', alignItems: 'left', justifyContent: 'center'}}>
                    <img src={"/svg/NewUser.svg"} style={{width: "90%"}} xs={0}/>
                </Col>
              </Row>
            </Container>

        </div>
    );
};

export default AddUsers;