import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {Button, Modal, Spinner} from "react-bootstrap";
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
                    <Skeleton count={5} />
                </div>
            }
            {!props.loading && props.children}
        </>
        )
};

export default CharSkeleton;
