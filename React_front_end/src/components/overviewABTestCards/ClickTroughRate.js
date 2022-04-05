import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';


const Purchases = (props) => {
    const navigation = useNavigate();
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [avargeCTR, setavargeCTR]  = React.useState([]);

    function processData(begin, end){
        setDatasets([]);
        setavargeCTR([]);
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        for(let algorithm in allData.algorithms){
            let data = [];
            let avargeCTRTemp = 0;
            allData.algorithms[algorithm].points.map((value1, index) =>{
                data.push(value1.ctr);
                avargeCTRTemp += value1.ctr;
            });

            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                }]);

            let avarge = (avargeCTRTemp/props.abTestData.points.length).toFixed(2);
            setavargeCTR(avargeCTR => [...avargeCTR,
                  [algorithm, avarge]
                ]);
        }
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard title={"Click Through Rate"} tooltip={"Purchases from day x to day y"}>
            {
                avargeCTR.map((value, index) => {
                    {return <h5>Avarage CTR for {value[0]} from {props.abTestData.points[props.startDate]} to {props.abTestData.points[props.endDate]}: {value[1]}</h5>}
                })
            }
            {labels.length < 500 &&
            <Line options={{
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
                  },
                }}

            data={{
              labels, datasets: datasets
            }} />}
            {labels.length >= 500 &&
                <p style={{color: "red"}}>To many datapoints to show in a graph</p>}
        </LargeInformationCard>
        )
};

export default Purchases;