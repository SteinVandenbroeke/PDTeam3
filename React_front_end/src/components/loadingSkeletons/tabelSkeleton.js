import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {Col,Row} from "react-bootstrap";
import React from "react";


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
