import {Button} from "react-bootstrap";
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
import SmoothingLineCard from "../smoothingLineChar";

const RevenueCard = (props) => {
    const navigation = useNavigate();
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [totalRevenue, setTotalRevenue]  = React.useState(0);
    const [loading, setLoading] = React.useState(true);


    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processData(begin, end){
        setLoading(true);
        setDatasets([]);
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let totalRev = 0;
        allData.NotAlgDependent.slice(begin, end + 1).map((value, index) =>{
                    data.push(value.Revenue);
                    totalRev += value.Revenue;
                });

        setTotalRevenue(totalRev);
        setDatasets(datasets => [...datasets, {
                  label: "Revenue",
                  data: data,
                }]);
        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard settings={props.slider} loading={loading} title={"Revenue"} tooltip={"Revenue from day x to day y"}>
            <h5>Total from {props.abTestData.points[props.startDate]} to {props.abTestData.points[props.endDate]}: € {totalRevenue.toFixed(2)}</h5>
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

export default RevenueCard;
