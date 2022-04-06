import {Button, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"

const LargeInformationCard = (props) => {
    const navigation = useNavigate();
    return (
        <div style={{paddingTop: 20}}>
            <Card className={"shadow"} style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 8, borderLeftColor: "#0d6efd"}}>
              <Card.Body>
                  {props.loading === true && <Spinner style={{position: "absolute", right: 0, margin: 10, top: 0}} animation="grow" size="sm" />}
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
        )
};

export default LargeInformationCard;
