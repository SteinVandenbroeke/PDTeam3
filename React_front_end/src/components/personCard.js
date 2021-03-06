import {Card, Button} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";

const PersonCard = (props) => {
    return (
        <div style={{paddingTop:10}}>
            <Card className="shadow" style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 15, borderLeftColor: "#0d6efd", display: 'flex', flexDirection: 'row', padding: 10}}>
                <img src={props.url} alt="Item" width="32px" height="32px"/>
                <Card.Body style={{flex: 1, padding: 0, paddingLeft: 8}}>
                    <Card.Text>{props.id}</Card.Text>
                </Card.Body>
                <Link to={"/dashboard/dataSets/overview/" + props.setid + "/person/" + props.id} class={"btn"}>
                    <Button>Info</Button>
                </Link>
            </Card>
        </div>
    )
}

PersonCard.defaultProps = {
    id: "4679",
    url: "/svg/personIcon.svg",
    setid: "0"
}

export default PersonCard;