import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate} from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"
import Slider from "../slider";

const CharSkeleton = (props) => {
    return (
        <>
            {props.loading &&

                <Row style={{paddingTop: 20}}>
                    <Col sm={1}>
                        <Skeleton height={50} />
                    </Col>
                    <Col sm={10} style={{paddingTop: 10}}>
                        <Skeleton height={20} />
                    </Col>
                    <Col sm={1}>
                        <Skeleton height={50} />
                    </Col>
                </Row>
            }
            {!props.loading && props.children}
        </>
        )
};

export default CharSkeleton;
