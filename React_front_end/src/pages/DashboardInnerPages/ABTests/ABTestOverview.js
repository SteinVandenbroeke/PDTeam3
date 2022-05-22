import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Col, Row, Table, Button, Text, Card, Form, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import SmallInformationCard from "../../../components/smallInformationCard"
import LargeInformationCard from "../../../components/largeInformationCard"
import Slider from "../../../components/slider"
import {Link, useParams} from "react-router-dom";
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
import ABTestInformation from "../../../components/overviewABTestCards/ABTestInformation";
import ActiveUserCard from "../../../components/overviewABTestCards/activeUserCard";
import Purchases from "../../../components/overviewABTestCards/Purchases";
import ClickTroughRate from "../../../components/overviewABTestCards/ClickTroughRate";
import AttributionRate from "../../../components/overviewABTestCards/attributionRate";
import AverageRevenueUser from "../../../components/overviewABTestCards/averageRevenueUser";
import MostRecomendedItems from "../../../components/overviewABTestCards/mostRecomendedItems";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";
import TabelSkeleton from "../../../components/loadingSkeletons/tabelSkeleton";
import CharSkeleton from "../../../components/loadingSkeletons/charSkeleton";
import SliderSkeleton from "../../../components/loadingSkeletons/sliderSkeleton";
import {useNavigate } from "react-router-dom";

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
    const navigation = useNavigate();
    const {abTestId} = useParams()
    const [values, setValues] = React.useState([0, 1]);
    const [totalUsers, setTotalUsers] = React.useState([0, 1]);
    const [abTestData, setAbTestData] = React.useState({
            "algorithms": [],
            "points": [0,0],
            "parameters": {
                "topK": null,
                "stepSize": null,
                "datasetId": null
            },
            "NotAlgDependent":[]
        });
    const [loading, setLoading] = React.useState(true);

    function loadData(){
        let getData = {
            "abTestName": abTestId
        };
        let request = new ServerRequest();
        request.sendGet("ABTestOverview", getData).then(requestData => {setAbTestData(requestData); setLoading(false);}).catch(error => {toast.error(error.message); /*setLoading(false)*/});
    }

    function loadTotalActiveUsers(){
        setTotalUsers(<Spinner animation="grow" size="sm" />);
        let getData = {abTestName: abTestId, startDate: abTestData.points[values[0]],endDate: abTestData.points[values[1]]};
        let request = new ServerRequest();
        request.sendGet("totalActiveUserAmount", getData).then(requestData => {setTotalUsers(requestData); setLoading(false);}).catch(error => {toast.error(error.message); setLoading(false);});
    }

    useEffect(() => {
        loadData();
    }, []);

    let slider = <Row style={{paddingTop: 20}}>
                    <Col sm={1}>
                        <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={abTestData.points[values[0]]} onChange={(e)=>{setValues([abTestData.points.indexOf(e.target.value), values[1]])}} />
                    </Col>
                    <Col sm={10}>
                        <Slider onFinalChange={loadTotalActiveUsers} labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
                    </Col>
                    <Col sm={1}>
                        <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={abTestData.points[values[1]]} onChange={(e)=>{setValues([values[0], abTestData.points.indexOf(e.target.value)])}} />
                    </Col>
                </Row>;

    let windowSmooting = <Row style={{paddingTop: 20}}>
                    <Col sm={1}>
                        <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={abTestData.points[values[0]]} onChange={(e)=>{setValues([abTestData.points.indexOf(e.target.value), values[1]])}} />
                    </Col>
                    <Col sm={10}>
                        <Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
                    </Col>
                    <Col sm={1}>
                        <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={abTestData.points[values[1]]} onChange={(e)=>{setValues([values[0], abTestData.points.indexOf(e.target.value)])}} />
                    </Col>
                </Row>;

    function deleteABTest(){
        setLoading(true);
        let request = new ServerRequest();
        let getData = {
            "abTestName": abTestId
        }
        request.sendGet("deleteABTest",getData).then(message => {toast.success(message.message); navigation('/dashboard/abTests', { replace: true }); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});

    }

    return (
        <div>
            <div style={{paddingTop: 20}}>
                <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                    <Button onClick={()=>deleteABTest()} variant="danger">Delete AB-Test</Button>
                </div>
                <SliderSkeleton loading={loading}>{slider}</SliderSkeleton>
                <Row>
                    <Col sm={4}>
                        <TabelSkeleton loading={loading}><ABTestInformation algorithms={abTestData.algorithms} parameters={abTestData.parameters}/></TabelSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><Purchases slider={slider} purchases={abTestData.NotAlgDependent.Purchases}
                                                                    abTestData={abTestData} startDate={values[0]} endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><ActiveUserCard totalUsers={totalUsers} slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                     endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><RevenueCard slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                     endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><AverageRevenueUser slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                            endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><ClickTroughRate slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <CharSkeleton loading={loading}><AttributionRate slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={4}>
                        <TabelSkeleton loading={loading}><MostRecomendedItems slider={slider} abTestData={abTestData} startDate={values[0]}
                                                                              endDate={values[1]}/></TabelSkeleton>
                    </Col>
                    <Col xs={2}>
                        <SmallInformationCard title={"Most buyed items"} value={
                            <Link
                                to={"/dashboard/abTests/overview/" + abTestId + "/items/" + values[0] + "&" + values[1]}
                                class={"btn"}>
                                <Button>Full list</Button>
                            </Link>
                        } tooltip={"Purchases from day x to day y"}/>

                    </Col>
                    <Col xs={2}>
                        <SmallInformationCard title={"Most active users"} value={
                            <Link
                                to={"/dashboard/abTests/overview/" + abTestId + "/persons/" + values[0] + "&" + values[1]}
                                class={"btn"}>
                                <Button>Full list</Button>
                            </Link>
                        } tooltip={"Purchases from day x to day y"}/>
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
