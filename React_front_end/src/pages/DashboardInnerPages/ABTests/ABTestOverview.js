import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button, Text, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import SmallInformationCard from "../../../components/smallInformationCard"
import LargeInformationCard from "../../../components/largeInformationCard"
import DoubleSlider from "../../../components/doubleSlider"
import {Link} from "react-router-dom";

const ABTestOverview = () => {
    const [values, setValues] = React.useState([20, 40]);
    return (
        <div>
            <div style={{paddingTop: 20}}>
                <DoubleSlider max={500} min={0} step={1} values={values} setValues={setValues} />
                <Row>
                    <Col>
                        <SmallInformationCard title={"Purchases"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                     <Col>
                        <SmallInformationCard title={"Purchases"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                     <Col>
                        <SmallInformationCard title={"Purchases"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                </Row>

                Meterieken overzicht
                <br/>
                vergelijking
                <br/>
                item lijst voor specifiek algoritme
                {/*
                <h3 style={{textAlign: "left"}}>Quick information</h3>
                <Row>
                    <Col><SmallInformationCard xs={12} title={"Purchases"} value={100} tooltip={"Amount of purchases over given periode"}></SmallInformationCard></Col>
                    <Col><SmallInformationCard xs={12} title={"Active Users"} value={100} tooltip={"Amount of purchases over given periode"}></SmallInformationCard></Col>
                    <Col><SmallInformationCard xs={12} title={"CTR"} value={100} tooltip={"Click Through Rate"}></SmallInformationCard></Col>
                    <Col><SmallInformationCard xs={12} title={"AR@D"} value={100} tooltip={"Attribution Rate"}></SmallInformationCard></Col>
                    <Col><SmallInformationCard xs={12} title={"ARPU@D"} value={100} tooltip={"Average Revenue Per User"}></SmallInformationCard></Col>
                </Row>
                */}
            </div>
        </div>
    );
};

export default ABTestOverview;
