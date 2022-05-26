import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
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
import ServerError from "../../../components/serverError";

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
    const [windowSizeSmoothing, setWindowSizeSmoothing] = React.useState([0]);
    const [values, setValues] = React.useState([0, 1]);
    const [totalUsers, setTotalUsers] = React.useState([0, 1]);
    const [serverError, setServerError] = useState(false);
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
        let getData = {abTestName: abTestId}
        let request = new ServerRequest();
        request.sendGet("ABTestOverview", getData).then(requestData => {setAbTestData(requestData); setLoading(false);}).catch(error => {toast.error(error.message); setServerError(true) /*setLoading(false)*/});
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

    let sliders = <Row style={{paddingTop: 20}}>
                    <Col sm={12}>
                        <SliderSkeleton loading={loading}>
                            <Slider onFinalChange={loadTotalActiveUsers} labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
                        </SliderSkeleton>
                    </Col>
                    <Col sm={12}>
                        <SliderSkeleton loading={loading}>
                            <Slider max={abTestData.points.length - 1} min={1} step={1} values={windowSizeSmoothing} setValues={setWindowSizeSmoothing} />
                        </SliderSkeleton>
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
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Button onClick={()=>deleteABTest()} variant="danger">Delete AB-Test</Button>
            </div>
            { !serverError &&
            <div style={{paddingTop: 20}}>
                {sliders}
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <TabelSkeleton loading={loading}><ABTestInformation algorithms={abTestData.algorithms} parameters={abTestData.parameters}/></TabelSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><ActiveUserCard smoothingWindow={windowSizeSmoothing} totalUsers={totalUsers} slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                     endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><Purchases smoothingWindow={windowSizeSmoothing} slider={sliders} purchases={abTestData.NotAlgDependent.Purchases}
                                                                    abTestData={abTestData} startDate={values[0]} endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><RevenueCard smoothingWindow={windowSizeSmoothing} slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                     endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><AverageRevenueUser smoothingWindow={windowSizeSmoothing} slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                            endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><ClickTroughRate smoothingWindow={windowSizeSmoothing} slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><AttributionRate smoothingWindow={windowSizeSmoothing} slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <TabelSkeleton loading={loading}><MostRecomendedItems slider={sliders} abTestData={abTestData} startDate={values[0]}
                                                                              endDate={values[1]}/></TabelSkeleton>
                    </Col>
                    <Col xs={6} md={3} lg={2}>
                        <SmallInformationCard title={"Most buyed items"} value={
                            <Link
                                to={"/dashboard/abTests/overview/" + abTestId + "/items/" + values[0] + "&" + values[1]}
                                class={"btn"}>
                                <Button>Full list</Button>
                            </Link>
                        } tooltip={"Purchases from day x to day y"}/>

                    </Col>
                    <Col xs={6} md={3} lg={2}>
                        <SmallInformationCard title={"Most active users"} value={
                            <Link
                                to={"/dashboard/abTests/overview/" + abTestId + "/persons/" + values[0] + "&" + values[1]}
                                class={"btn"}>
                                <Button>Full list</Button>
                            </Link>
                        } tooltip={"Purchases from day x to day y"}/>
                    </Col>
                </Row>
            </div>}
            <ServerError error={serverError}/>
        </div>
    );
};

export default ABTestOverview;
