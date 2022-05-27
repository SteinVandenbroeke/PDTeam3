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
    const [userdata,setUserData] = useState([["User Id","Purchase Amount", "Total Purchases", "Purchases In Range", "Total CTR", "CTR In Range"]])
    const [itemData,setItemData] = useState([['Item Id', 'Title', 'Total Buy Rate', 'Buy Rate In Range', 'Total Recommend Rate', 'Recommend Rate In Range']])
    const [data1,setData1] = useState([["User Id","Purchase Amount", "Total Purchases", "Purchases In Range", "Total CTR", "CTR In Range"]])

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

    function openUser(id){
        //navigation("/dashboard/dataSets/overview/"+ datasetId + "/person/"+ id);
    }

    function openItem(id){
        //navigation("/dashboard/dataSets/overview/"+ datasetId + "/item/"+ id);
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
        request.sendGet("getItemsFromABTest",getData).then(requestData => {setItemData(oldData=>[...oldData,...requestData]); setLoadingModelData(false)}).catch(error => {toast.error(error.message); setLoadingModelData(false)});
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
        request.sendGet("getUsersFromABTest",getData).then(requestData => {setUserData(oldData=>[...oldData,...requestData[0]]); setLoadingModelData(false)}).catch(error => {toast.error(error.message); setLoadingModelData(false)});
    }

    function openFullItemList(){
        setCurrentPage("items");
    }

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
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
                            <Card className={"shadow"} style={{textAlign: "left", maxHeight: "80vh", marginBottom: 10}}>
                              <Card.Body style={{height: "100%"}}>
                                  {sliders}
                              </Card.Body>
                            </Card>
                            <Card className={"shadow"} style={{textAlign: "left", maxHeight: "80vh", borderWidth: 0, borderLeftWidth: 8, borderLeftColor: "#0d6efd"}}>
                              <Card.Body style={{height: "100%"}}>
                                  <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                                      {currentPage === "persons" && <TabelSkeleton loading={loadingModelData}><LogicTable action={openItem} data={userdata}/></TabelSkeleton>}
                                      {currentPage === "items" && <TabelSkeleton loading={loadingModelData}><LogicTable action={openUser} data={itemData}/></TabelSkeleton>}
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
                    <Col xs={12} md={6} lg={4}>
                        <TabelSkeleton loading={loading}><MostRecomendedItems
                                                                              showFullList={openFullItemList}
                                                                              slider={sliders}
                                                                              abTestData={abTestData}
                                                                              startDate={values[0]}
                                                                              endDate={values[1]}/></TabelSkeleton>
                    </Col>
                    <Col xs={6} md={3} lg={2}>
                        <SmallInformationCard title={"Most active users"} value={
                            <Button onClick={()=>{setCurrentPage("persons")}}>Full list</Button>
                        } tooltip={"Purchases from day x to day y"}/>
                    </Col>
                </Row>
            </div>}
            <ServerError error={serverError}/>
        </div>
    );
};

export default ABTestOverview;
