import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
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
    const [values, setValues] = React.useState([20, 40]);
    const labels = ['Dag 1', 'Dag 2', 'Dag 3', 'Dag 4', 'Dag 5', 'Dag 6', 'Dag 7'];
    console.log(labels.map(() => Math.floor(Math.random() * 1000)));
    return (
        <div>
            <div style={{paddingTop: 20}}>
                <Slider max={500} min={0} step={1} values={values} setValues={setValues} />
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
                        <LargeInformationCard title={"Revenue"} value={20} tooltip={"Purchases from day x to day y"}>
                            <h5>Total from X to Y: 20</h5>

                            <Line options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      position: 'top',
                                    },
                                    title: {
                                      display: false,
                                    },
                                  },
                                }}

                            data={{
                              labels,
                                datasets: [
                                {
                                  label: 'Algoritme A',
                                  data: [94, 530, 476, 789, 986, 389, 451],
                                }, {
                                  label: 'Algoritme B',
                                  data: [60, 400, 300, 200, 70, 100, 351],
                                }, {
                                  label: 'Algoritme C',
                                  data: [20, 50, 400, 80, 300, 300, 150],
                                },
                              ],
                            }} />
                        </LargeInformationCard>
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
