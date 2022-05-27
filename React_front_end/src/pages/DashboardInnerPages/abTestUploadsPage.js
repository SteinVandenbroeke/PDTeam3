import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Icon from 'react-eva-icons';
import AbtestLoading from "../../components/AbtestLoading";
import TextSkeleton from "../../components/loadingSkeletons/textSkeleton";

const AbTestUploadsPage = () => {
    return (
        <div className="App">
            <header>
                <h1>A/B test making progress</h1>
                <AbtestLoading></AbtestLoading>
            </header>
        </div>
    );
};

export default AbTestUploadsPage;
