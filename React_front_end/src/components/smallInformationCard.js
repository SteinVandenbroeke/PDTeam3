import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"

const SmallInformationCard = (props) => {
    const navigation = useNavigate();
    return (
        <div style={{paddingTop: 20}}>
            <Card className={"shadow"} style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 15, borderLeftColor: "#0d6efd"}}>
              <Card.Body>
                  <OverlayTrigger
                    overlay={<Tooltip id="button-tooltip-2">{props.tooltip}</Tooltip>}
                  >
                      <h3>{props.title}</h3>
                  </OverlayTrigger>
                <h1 style={{textAlign: "right"}}>{props.value}</h1>
              </Card.Body>
            </Card>
        </div>
        )
};

export default SmallInformationCard;
