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

const RevenueCard = (props) => {
    const navigation = useNavigate();
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [totalRevenue, setTotalRevenue]  = React.useState(0);

    function processData(begin, end){
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

        /*
        allData.algoritms.map((value, index) => {
            let data = [];
            allData[value].points.map((value1, index) =>{
                data.push(value1.Revenue);
            });

            setDatasets(datasets => [...datasets, {
                  label: value,
                  data: data,
                }]);
        });**/
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard title={"Revenue"} value={20} tooltip={"Purchases from day x to day y"}>
            <h5>Total from {props.startDate} to {props.endDate}: € {totalRevenue}</h5>
            {}
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
              labels, datasets: datasets
            }} />
        </LargeInformationCard>
        )
};

export default RevenueCard;
