import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Col, Row, Table, Button, Form, Card, Container, Badge, Tabs, Tab, Spinner} from "react-bootstrap";
import { ServerRequest } from '../../logic/ServerCommunication';
import { toast } from 'react-toastify';

const UploadDatasetToServer = (props) => {
    let [uploading , setUploading] = useState(0);
    let [dataSetName , setDataSetName] = useState(0);

    function upload(csvInteractions, csvUsers, csvItems, interactionConnections, usersConnections, itemConnections){
        setUploading(1);
        let request = new ServerRequest();
        var formData = new FormData();
        formData.append("interactionConnections", JSON.stringify(interactionConnections));
        formData.append("usersConnections",  JSON.stringify(usersConnections));
        formData.append("itemConnections",  JSON.stringify(itemConnections));
        formData.append('interactionCsv', csvInteractions);
        formData.append('userCsv', csvUsers);
        formData.append('itemCsv', csvItems);
        formData.append('datasetName', dataSetName);
        request.sendPost("uploadDataset",formData, true).then(message => {toast.success(message.message); setUploading(2)}).catch(error => {toast.error(error.message); setUploading(3)});
    }

    return (
        <div>
                <Row style={{paddingTop: 20}}>
                    <Col xs={12} sm={12} md={7} style={{padding: 40}}>
                        <Card className={"shadow-lg"}>
                            { uploading === 0 &&
                              <Card.Body>
                                  <h5>Upload to server</h5>
                                  <Form.Group className="mb-3" style={{paddingRight: "50%"}}>
                                      <Form.Label>Dataset name</Form.Label>
                                      <Form.Control placeholder="Dataset name" onChange={(e)=>setDataSetName(e.target.value)} />
                                  </Form.Group>
                                  <div style={{paddingRight: "50%", paddingTop: 20, paddingBottom: 20}}>
                                      {props.files.map((file, index) => {
                                        return (
                                          <Card className={"shadow"}>
                                          <Card.Body>
                                              <Row>
                                                  <Col>
                                                      <h5>{file.name}</h5>
                                                  </Col>
                                                  <Col style={{textAlign: "right"}}>
                                                       <h7>{Math.round((file.size/1024)/1024) }MB</h7>
                                                  </Col>
                                              </Row>
                                          </Card.Body>
                                      </Card>)
                                        })}
                                  </div>
                                  <Button variant="primary" onClick={() => upload(props.interactionCSV, props.usersCSV, props.itemsCSV, props.interactionConnections, props.UsersConnections, props.itemsConnections)}>Upload</Button>{' '}
                              </Card.Body>
                            }

                            { uploading === 1 &&
                              <Card.Body>
                                  <h5>Upload to server</h5>
                                  <div style={{paddingRight: "50%", paddingTop: 20, paddingBottom: 20}}>
                                      <h1>Bestanden uploaden</h1>
                                      <Spinner animation="border" role="status">
                                          <span className="visually-hidden">Loading...</span>
                                      </Spinner>
                                  </div>
                              </Card.Body>
                            }

                            { uploading === 2 &&
                              <Card.Body>
                                  <h5>Upload to server</h5>
                                  <div style={{paddingRight: "50%", paddingTop: 20, paddingBottom: 20}}>
                                      <h1>Bestanden zijn succesvol geupload, u vindt de dataset onder 'datasets'</h1>
                                  </div>
                              </Card.Body>
                            }

                             { uploading === 3 &&
                              <Card.Body>
                                  <h5>Upload to server</h5>
                                  <Form.Group className="mb-3" style={{paddingRight: "50%"}}>
                                      <Form.Label>Dataset name</Form.Label>
                                      <Form.Control placeholder="Dataset name" onChange={(e)=>setDataSetName(e.target.value)} />
                                  </Form.Group>
                                  <div style={{paddingRight: "50%", paddingTop: 20, paddingBottom: 20}}>
                                      <h1>Er ging iets fout bij het uploaden</h1>
                                      <Button variant="primary" onClick={() => upload(props.interactionCSV, props.usersCSV, props.itemsCSV, props.interactionConnections, props.UsersConnections, props.itemsConnections)}>Try Again</Button>{' '}
                                  </div>
                              </Card.Body>
                            }
                        </Card>

                    </Col>
                    <Col xs={0} sm={0} md={5}>
                        <img src={"/svg/upload1.svg"} style={{width: "90%"}} xs={0}/>
                    </Col>
                </Row>
        </div>
        )
};

export default UploadDatasetToServer;
