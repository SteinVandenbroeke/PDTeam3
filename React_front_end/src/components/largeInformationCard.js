import {Button, Modal, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"

const LargeInformationCard = (props) => {
    const navigation = useNavigate();

    const [model, setModel] = React.useState(false);
    return (
        <>
            <Modal show={model} fullscreen={true}>
                <Modal.Header closeButton onClick={()=>setModel(false)}>
                  <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{paddingTop: 20}}>
                        {props.settings != null &&
                        <Card className={"shadow"} style={{textAlign: "left", maxHeight: "80vh", marginBottom: 10}}>
                          <Card.Body style={{height: "100%"}}>
                              {props.loading === true && <Spinner style={{position: "absolute", right: 0, margin: 10, top: 0}} animation="grow" size="sm" />}
                              {props.settings}
                          </Card.Body>
                        </Card>}
                        <Card className={"shadow"} style={{textAlign: "left", maxHeight: "80vh", borderWidth: 0, borderLeftWidth: 8, borderLeftColor: "#0d6efd"}}>
                          <Card.Body style={{height: "100%"}}>
                              {props.loading === true && <Spinner style={{position: "absolute", right: 0, margin: 10, top: 0}} animation="grow" size="sm" />}
                              {props.children}
                          </Card.Body>
                        </Card>
                    </div>
                </Modal.Body>
            </Modal>
            <div style={{paddingTop: 20}}>
                <Card className={"shadow"} style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 8, borderLeftColor: "#0d6efd"}}>
                  <Card.Body>
                      {props.loading === true && <Spinner style={{position: "absolute", right: 0, margin: 10, top: 0}} animation="grow" size="sm" />}

                      <a href={"#"} onClick={()=>setModel(true)} style={{position: "absolute", right: 10, top: 10}}>
                          <Icon name="expand-outline" fill="back"/>
                      </a>
                      <OverlayTrigger
                        overlay={<Tooltip id="button-tooltip-2">{props.tooltip}</Tooltip>}
                      >
                          <h3>
                              {props.title}
                          </h3>
                      </OverlayTrigger>
                      {props.children}
                  </Card.Body>
                </Card>
            </div>
        </>
        )
};

export default LargeInformationCard;
