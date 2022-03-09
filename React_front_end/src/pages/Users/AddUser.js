import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Card, Container, ListGroup, Form, Button, Col, Row, Image} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";
import ProfileImageMenu from "../../components/profileImageMenu";

import 'bootstrap/dist/css/bootstrap.min.css';


const AddUsers = () => {
    let date = new Date();
    const maxDateValue = date.toISOString().split("T")[0];
    function setImage(path) {
        console.log(path)
    }
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
                                    <Form.Label onClick={setImage(date)}>Admin Permission</Form.Label>
                                    <Form.Check/>
                                </Col>
                            </Row>
                            <Row style={{padding:10}}>
                                <Col>
                                    <Form.Group controlId="ProfilePic" className="mb-3">
                                        <Form.Label >Add profile picture</Form.Label>
                                        <Form.Control  type="file" accept=".png,.jpg"/>
                                     </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Image roundedCircle={true} height={50} src={"https://scontent.fbru1-1.fna.fbcdn.net/v/t1.6435-9/78431746_2293299950961562_7867165954851995648_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=UpMJOOQDA7EAX-FFLhh&_nc_ht=scontent.fbru1-1.fna&oh=00_AT--woVzrD7i2DiqMtz8n0KS3O0dvV2-8lG7QUWQde11eQ&oe=624621AC"}></Image>
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