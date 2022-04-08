import {Card, Button} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";

const ItemCard = (props) => {
    return (
        <div style={{paddingTop:10}}>
            <Card className="card-horizontal shadow" style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 15, borderLeftColor: "#0d6efd", display: 'flex', flexDirection: 'row', padding: 10}}>
                <img src={props.url} alt="Item" width="32px" height="32px" />
                <Card.Body style={{flex: 0.3, padding: 0, paddingLeft: 8}}>
                    <Card.Text>{props.name}</Card.Text>
                </Card.Body>
                <Card.Body style={{flex: 0.7, padding: 0, paddingLeft: 8}}>
                    <Card.Text>
                        {props.desc}
                    </Card.Text>
                </Card.Body>
                <Link to={"/dashboard/dataSets/item/" + props.id} class={"btn"}>
                    <Button>Info</Button>
                </Link>
            </Card>
        </div>
    )
}

ItemCard.defaultProps = {
    name: "Item Name",
    desc: "Short Item Description",
    url: "/svg/itemIcon.svg",
    id: "1235"
}

export default ItemCard;