import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Col, Row, Table, Button, Text, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import SmallInformationCard from "../../../components/smallInformationCard"
import LargeInformationCard from "../../../components/largeInformationCard"
import Slider from "../../../components/slider"
import {Link} from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
} from 'chart.js';
import RevenueCard from "../../../components/overviewABTestCards/revenueCard";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

const ABTestOverview = () => {
    const [values, setValues] = React.useState([0, 1]);
    const [abTestData, setAbTestData] = React.useState({
            "algoritms": [],
            "points": [0,0],
            "parameters": {
                "windowSize": null,
                "learingPeriod": null,
                "dataset": null
            },
            "NotAlgDependent":[]
        });

    function loadData(){
        setAbTestData({
            "algoritms": ["Popularity","Recency"],
            "parameters": {
                "windowSize": 1,
                "learingPeriod": 20,
                "dataset": "H&M dataset",
                "eventuele extra parameters":"?"
            },
            "points": ["01/01/2022", "02/01/2022", "03/01/2022"],
            "Popularity":{
                "points": [
                    {
                        "ctr": 10,
                        "ard": 15,
                        "arpu": 40,
                        "mostRecomendedItems": ["T-shirt", "Schoen", "Trui"],
                    },
                    {
                        "ctr": 8,
                        "ard": 16,
                        "arpu": 30,
                        "mostRecomendedItems": ["Schoen", "Broek", "Trui"],
                    },
                    {
                        "ctr": 15,
                        "ard": 20,
                        "arpu": 30,
                        "mostRecomendedItems": ["BH", "Trui", "Broek"],
                    }]
            },
            "Recency":{
                "points":[
                    {
                        "ctr": 5,
                        "ard": 8,
                        "arpu": 15,
                        "mostRecomendedItems": ["T-shirt", "Schoen", "Trui"],
                    },
                    {
                        "ctr": 7,
                        "ard": 14,
                        "arpu": 15,
                        "mostRecomendedItems": ["Schoen", "Broek", "Trui"],
                    },
                    {
                        "ctr": 10,
                        "ard": 15,
                        "arpu": 25,
                        "mostRecomendedItems": ["BH", "Trui", "Broek"],
                    }
                ]
            },
            "NotAlgDependent":[
                {
                    "Purchases": 80,
                    "Revenue": 100,
                    "activeUsersAmount": 150
                },
                {
                    "Purchases": 70,
                    "Revenue": 120,
                    "activeUsersAmount": 153
                },
                {
                    "Purchases": 76,
                    "Revenue": 110,
                    "activeUsersAmount": 158
                }
            ]
        });
    }

    useEffect(() => {
        loadData();
    }, []);


    useEffect(() => {
    }, [abTestData]);

    return (
        <div>
            <div style={{paddingTop: 20}}>
                <Slider max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
                <Row>
                    <Col>
                        <SmallInformationCard title={"AB test information"} value={20} tooltip={"Purchases from day x to day y"}/>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Purchases"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                     <Col>
                        <SmallInformationCard title={"Active Users"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                     <Col>
                        <SmallInformationCard title={"Click Through Rate"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Attribution Rate"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Average Revenue Per User"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Most recomended items"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Most buyed items"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <SmallInformationCard title={"Most active users"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
                    </Col>
                    <Col>
                        <RevenueCard abTestData={abTestData} startDate={values[0]} endDate={values[1]} />
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
