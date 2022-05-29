import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Col, Row, Table, Button, Text, Card, Form, Spinner, Modal} from "react-bootstrap";
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
    const [currentPage, setCurrentPage] = React.useState("overview");
    const [windowSizeSmoothing, setWindowSizeSmoothing] = React.useState([1]);
    const [values, setValues] = React.useState([0, 1]);
    const [totalUsers, setTotalUsers] = React.useState([0, 1]);
    const [serverError, setServerError] = useState(false);
    const [abTestData, setAbTestData] = React.useState({
            "dataSet": null,
            "algorithms": [],
            "points": [0,0,0],
            "parameters": {
                "topK": null,
                "stepSize": null,
                "datasetId": null
            },
            "NotAlgDependent":[]
        });
    const [loading, setLoading] = React.useState(true);
    const [loadingModelData, setLoadingModelData] = React.useState(true);
    const [userdata,setUserData] = useState()
    const [itemData,setItemData] = useState()

    async function loadData(){
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

    function sliderOrPageChange(){
        if(currentPage === "overview"){
            loadTotalActiveUsers();
        }
        else if(currentPage === "persons"){
            loadUsers();
        }
        else if(currentPage === "items"){
            loadItems();
        }
    }

    useEffect(() => {
        setLoadingModelData(true)
        sliderOrPageChange();
    }, [currentPage]);

    useEffect(() => {
        loadData();
    }, []);

    let sliders = <Row style={{paddingTop: 20}}>
                    <Col sm={12}>
                        <SliderSkeleton loading={loading}>
                            <Slider onFinalChange={sliderOrPageChange} labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
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

    function resetABTest(){
        setLoading(true);
        let request = new ServerRequest();
        let getData = {
            "abTestName": abTestId
        }
        request.sendGet("resetAbTests",getData).then(message => {toast.success(message.message); navigation('/dashboard/abTestUploads', { replace: true }); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function openUser(id){
        window.open("/full/dataSets/overview/"+ abTestData.dataSet + "/person/"+ id, '_blank', 'resizable=yes,scrollbars=yes,status=yes')
        //navigation("/dashboard/dataSets/overview/"+ abTestData.dataSet + "/person/"+ id);
    }

    function openItem(id){
        window.open("/full/dataSets/overview/"+ abTestData.dataSet + "/item/"+ id, '_blank', 'resizable=yes,scrollbars=yes,status=yes')
        //navigation("/dashboard/dataSets/overview/"+ abTestData.dataSet + "/item/"+ id);
    }

    async function loadItems(){
        setLoadingModelData(true);
        let begin = values[0];
        let end = values[1];
        let getData = {
            "abTestId": abTestId,
            "startDate": abTestData.points[begin],
            "endDate": abTestData.points[end],
        }
        let request = new ServerRequest();
        request.sendGet("getItemsFromABTest",getData).then(requestData => {setItemData(requestData); setLoadingModelData(false)}).catch(error => {toast.error(error.message); setLoadingModelData(false)});
    }

    async function loadUsers(){
        setLoadingModelData(true);
        let begin = values[0];
        let end = values[1];
        let getData = {
            "abTestId": abTestId,
            "startDate": abTestData.points[begin],
            "endDate": abTestData.points[end],
        };
        let request = new ServerRequest();
        request.sendGet("getUsersFromABTest",getData).then(requestData => {setUserData(requestData); setLoadingModelData(false)}).catch(error => {toast.error(error.message); setLoadingModelData(false)});
    }

    function openFullItemList(){
        setCurrentPage("items");
    }

    function openFullPersonList(){
        setCurrentPage("persons");
    }

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Button onClick={()=>resetABTest()} variant="warning">Reset AB-Test</Button>
                {" "}
                <Button onClick={()=>deleteABTest()} variant="danger">Delete AB-Test</Button>
            </div>
            { !serverError &&
            <div style={{paddingTop: 20}}>
                <Modal show={currentPage === "persons" || currentPage === "items"} fullscreen={true}>
                    <Modal.Header closeButton onClick={()=>setCurrentPage("overview")}>
                      <Modal.Title>{currentPage}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{paddingTop: 20}}>
                            <Card className={"shadow"} style={{textAlign: "left", marginBottom: 10}}>
                              <Card.Body style={{height: "100%"}}>
                                  {sliders}
                              </Card.Body>
                            </Card>
                            <Card className={"shadow"} style={{textAlign: "left", borderWidth: 0, borderLeftWidth: 8, borderLeftColor: "#0d6efd"}}>
                              <Card.Body style={{height: "100%"}}>
                                  <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                                      {currentPage === "persons" && <TabelSkeleton loading={loadingModelData}><LogicTable action={openUser} data={userdata}/></TabelSkeleton>}
                                      {currentPage === "items" && <TabelSkeleton loading={loadingModelData}><LogicTable action={openItem} data={itemData}/></TabelSkeleton>}
                                  </div>
                              </Card.Body>
                            </Card>
                        </div>
                    </Modal.Body>
                </Modal>
                {sliders}
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <TabelSkeleton loading={loading}><ABTestInformation algorithms={abTestData.algorithms}
                                                                            parameters={abTestData.parameters}/></TabelSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><ActiveUserCard smoothingWindow={windowSizeSmoothing}
                                                                        totalUsers={totalUsers} slider={sliders}
                                                                        abTestData={abTestData}
                                                                        startDate={values[0]}
                                                                        endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><Purchases smoothingWindow={windowSizeSmoothing}
                                                                   slider={sliders}
                                                                   purchases={abTestData.NotAlgDependent.Purchases}
                                                                   abTestData={abTestData} startDate={values[0]}
                                                                   endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><RevenueCard smoothingWindow={windowSizeSmoothing}
                                                                     slider={sliders} abTestData={abTestData}
                                                                     startDate={values[0]}
                                                                     endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><AverageRevenueUser smoothingWindow={windowSizeSmoothing}
                                                                            slider={sliders} abTestData={abTestData}
                                                                            startDate={values[0]}
                                                                            endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><ClickTroughRate smoothingWindow={windowSizeSmoothing}
                                                                         slider={sliders} abTestData={abTestData}
                                                                         startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <CharSkeleton loading={loading}><AttributionRate smoothingWindow={windowSizeSmoothing}
                                                                         slider={sliders} abTestData={abTestData}
                                                                         startDate={values[0]}
                                                                         endDate={values[1]}/></CharSkeleton>

                    </Col>
                    <Col xs={6} md={3} lg={4}>
                        <SmallInformationCard title={"Most recommended items"} value={
                            <Button onClick={()=>{setCurrentPage("items")}}>Show list</Button>
                        } tooltip={"Item recommend rate list from day x to day y"}/>

                    </Col>
                    <Col xs={6} md={3} lg={4}>
                        <SmallInformationCard title={"Most active users"} value={
                            <Button onClick={()=>{setCurrentPage("persons")}}>Show list</Button>
                        } tooltip={"Purchases from day x to day y"}/>
                    </Col>
                </Row>
            </div>}
            <ServerError error={serverError}/>
        </div>
    );
};

export default ABTestOverview;
