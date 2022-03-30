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

const ABTestOverview = () => {
    const [values, setValues] = React.useState([20, 40]);

    return (
        <div>
            <div style={{paddingTop: 20}}>
                <Slider max={500} min={0} step={1} values={values} setValues={setValues} />
                <Row>
                    <Col>
                        <SmallInformationCard title={"AB test information"} value={20} tooltip={"Purchases from day x to day y"}></SmallInformationCard>
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
                            <h5>Total: 20</h5>
                            {/*
                            <Line options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  position: 'top',
                                },
                                title: {
                                  display: true,
                                  text: 'Chart.js Line Chart',
                                },
                              },
                            }}

                            data={{
                                datasets: [
                                {
                                  label: 'Dataset 1',
                                  data: [0,1,2,3,4,5,6,7],
                                  borderColor: 'rgb(255, 99, 132)',
                                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                }
                              ],
                            }} />*/}
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
