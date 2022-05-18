import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {Button, Col, Modal, Row, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate} from "react-router-dom";
import React from "react";
import {Link} from "react-router-dom";
import {Card, OverlayTrigger, Tooltip} from "react-bootstrap"

const CharSkeleton = (props) => {
    return (
        <>
            {props.loading &&
                <div style={{paddingTop: 20}}>
                    <Skeleton height={50} />
                    {
                        Array(3).fill(0).map((item) => {
                            return (<Row>
                                {Array(4).fill(0).map((item1) => {
                                            return (
                                                    <Col lg="3">
                                                        <Skeleton count={1} height={50} />
                                                    </Col>)})}
                                    </Row>)
                        })
                    }
                </div>
            }
            {!props.loading && props.children}
        </>
        )
};

export default CharSkeleton;
