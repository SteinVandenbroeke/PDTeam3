import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"

const ServerError = (props) => {
    const navigation = useNavigate();

    function reload(){
        window.location.reload();
    }

    return (<>{props.error && <div><img src={"/svg/serverDown.svg"} style={{width: "20%"}}/><h2 style={{paddingTop: 30}}>Failed server request or wrong data</h2><Button variant="primary" onClick={()=>reload()}>Reload</Button></div>}</>)

};

export default ServerError;
