import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Card, Container, ListGroup, Form, Button, Col, Row, Image} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";
import ProfileImageMenu from "../../components/profileImageMenu";

import 'bootstrap/dist/css/bootstrap.min.css';


const AddUsers = () => {

    const [formData, setFormData] = useState({firstName: "", image: null});

    let date = new Date();
    const maxDateValue = date.toISOString().split("T")[0];
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
                            <Row style={{paddingBottom:10}}>
                                <Col>
                                   <Form.Label>Date of Birth</Form.Label>
                                   <Form.Control style={{ textAlign:"center"}} max={maxDateValue} type="date" name="dob" placeholder="Date of Birth"/>
                                </Col>
                                <Col>
                                    <Form.Label>Admin Permission</Form.Label>
                                    <Form.Check/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="ProfilePic" className="mb-3">
                                        <Form.Label >Add profile picture</Form.Label>
                                        <Form.Control onChange={(e)=> setFormData({image: e.target.files[0]})} type="file" accept=".png,.jpg"/>
                                     </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Image roundedCircle={true} height={50} src={formData.image == null? "https://cdn.pixabay.com/photo/2017/11/10/05/24/select-2935439_960_720.png" : URL.createObjectURL(formData.image)}></Image>
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