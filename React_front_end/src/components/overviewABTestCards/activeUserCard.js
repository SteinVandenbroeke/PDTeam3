import {Button, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
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
import SmallInformationCard from "../smallInformationCard";
import {ServerRequest} from "../../logic/ServerCommunication";
import {toast} from "react-toastify";
import SmoothingLineCard from "../smoothingLineChar";

const ActiveUserCard = (props) => {
    const navigation = useNavigate();
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    async function processData(begin, end){
        setLoading(true);
        setDatasets([]);
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let data1 = [];

        allData.NotAlgDependent.slice(begin, end + 1).map((value, index) =>{
                    data.push(value.activeUsersAmount);
                    data1.push(allData.parameters.userCount)
                });

        setDatasets(datasets => [...datasets, {
                  label: "Active users",
                  data: data,
                }]);
        setDatasets(datasets => [...datasets, {
                  label: "Total users",
                  data: data1,
                  backgroundColor: '#84c98b',
                  borderColor: '#84c98b' + 80,
                  hidden: true
                }]);
        setLoading(false)
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard settings={props.slider} loading={loading} title={"Users"} value={20} tooltip={"Purchases from day x to day y"}>
            <h5>Total active users in interval: {props.totalUsers}</h5>
            {labels.length < 500 &&
            <SmoothingLineCard height={"100%"} smoothingWindow={props.smoothingWindow} options={{
                backgroundColor: 'rgba(13,110,253,1)',
                borderColor: 'rgba(13,110,253,0.5)',
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 1
                            }
                        }
                    }
                  },
                }}
            labels={labels}
            data={datasets}
            />}
            {labels.length >= 500 &&
                <p style={{color: "red"}}>To many datapoints to show in a graph</p>}
        </LargeInformationCard>
        )
};

export default ActiveUserCard;
