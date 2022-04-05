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

        let points1 = [];
        let points2 = [];
        let points3 = [];
        let dates = [];
        let currentDate = new Date("05/01/2021");
        for(let i = 0; i < 10000; i++){
            points1.push({
                        "ctr": Math.floor(Math.random() * 100),
                        "ard": Math.floor(Math.random() * 100),
                        "arpu": Math.floor(Math.random() * 100),
                        "mostRecomendedItems": ["T-shirt", "Schoen", "Trui"],
                    });

            points2.push({
                        "ctr": Math.floor(Math.random() * 100),
                        "ard": Math.floor(Math.random() * 100),
                        "arpu": Math.floor(Math.random() * 100),
                        "mostRecomendedItems": ["T-shirt", "Schoen", "Trui"],
                    })

            points3.push(
                {
                    "Purchases": Math.floor(Math.random() * 100),
                    "Revenue": Math.floor(Math.random() * 100),
                    "activeUsersAmount": Math.floor(Math.random() * 100)
                }
            )
            dates.push(currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getFullYear());
            currentDate.setDate(currentDate.getDate() + 1);
        }
        alert("making done");
        setAbTestData({
            "algoritms": ["Popularity","Recency"],
            "parameters": {
                "windowSize": 1,
                "learingPeriod": 20,
                "dataset": "H&M dataset",
                "eventuele extra parameters":"?"
            },
            "points": dates,
            "Popularity":{
                "points": points1
            },
            "Recency":{
                "points":points2
            },
            "NotAlgDependent":points3
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
