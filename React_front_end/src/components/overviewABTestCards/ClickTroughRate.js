import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';
import SmoothingLineCard from "../smoothingLineChar";


const Purchases = (props) => {
    const navigation = useNavigate();
    const [labels, setlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [avargeCTR, setavargeCTR]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showAllDataPoints, setShowAllDataPoints] = React.useState(false);
    const graphColors =  ['#84c98b', '#ED5C77', '#bc1ed7', '#0c1f3d', '#D4A418', '#00AAB5', '#D9730C', '#A7AABD','#328984']

    async function processData(begin, end){
        setShowAllDataPoints(false)
        setLoading(true);
        setDatasets([]);
        setavargeCTR([]);
        let allData = props.abTestData;

        setlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let colorCounter = 0;
        for(let algorithm in allData.algorithms){
            let data = [];
            let avargeCTRTemp = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                data.push(value1.ctr);
                avargeCTRTemp += value1.ctr;
            });

            let colorGraph = graphColors[colorCounter];
            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                  backgroundColor: colorGraph,
                  borderColor: colorGraph + 80,
                }]);

            let avarge = (avargeCTRTemp/props.abTestData.points.slice(begin, end + 1).length).toFixed(2);
            setavargeCTR(avargeCTR => [...avargeCTR,
                  ["alg id " + algorithm, avarge]
                ]);
            colorCounter++;
            if(colorCounter >= graphColors.length){
                colorCounter = 0;
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard settings={props.slider} loading={loading} title={"Click Through Rate"} tooltip={"Purchases from day x to day y"}>
            {
                avargeCTR.map((value, index) => {
                    {return <h5>Avarage CTR for {value[0]} in interval: {value[1]}</h5>}
                })
            }
            {(labels.length < 50 || showAllDataPoints) &&
            <SmoothingLineCard height={"100%"} smoothingWindow={props.smoothingWindow} options={{
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
            labels={labels}
            data={datasets}
            />}
            {(labels.length >= 50 && !showAllDataPoints) &&
                <div><p style={{color: "red"}}>To many datapoints to show in a graph</p><Button variant="primary" onClick={()=>setShowAllDataPoints(true)}>Just show</Button></div>}
        </LargeInformationCard>
        )
};

export default Purchases;