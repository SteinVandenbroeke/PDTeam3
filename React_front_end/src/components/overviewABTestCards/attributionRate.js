import {Button, Form} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';
import SmoothingLineCard from "../smoothingLineChar";


const Purchases = (props) => {
    const navigation = useNavigate();
    const [daysSwitch, setDaysSwitch] = React.useState(true) // false = 7 dagen
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [averageARD, setaverageARD]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showAllDataPoints, setShowAllDataPoints] = React.useState(false);
    const graphColors = ['#0d6efd', '#84c98b', '#27292d', '#bc1ed7', '#2b2b2b', '#0c1f3d', '#84c98b']

    const switchDays = (pm1) => {

        console.log("bool1: "+daysSwitch + pm1)
        setDaysSwitch(pm1)
        /*if(daysSwitch){
            setDaysSwitch(false)
        } else{
            setDaysSwitch(true)*/
        //setDaysSwitch(!daysSwitch)
        console.log("bool2: "+daysSwitch)
        processData(props.startDate,props.endDate);

    }

    async function processData(begin, end){
        setShowAllDataPoints(false)
        //TODO check if correct
        setLoading(true);
        setDatasets([]);
        setaverageARD([]);
        Letlabels([])
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let colorCounter = 0;
        let value = 0;


        for(let algorithm in allData.algorithms){
            let data = [];
            let averageARDTemp = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                if(!daysSwitch){
                    value = value1.ard7
                    console.log('ar is 7 days')
                }
                else{
                    value = value1.ard30
                    console.log('ar is 30 days')
                }
                data.push(value);
                averageARDTemp += value;
            });

            let colorGraph = graphColors[colorCounter];
            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                  backgroundColor: colorGraph,
                  borderColor: colorGraph + 80,
                }]);

            let average = (averageARDTemp/props.abTestData.points.slice(begin, end + 1).length).toFixed(2);
            setaverageARD(averageARD => [...averageARD,
                  [algorithm, average]
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
        <LargeInformationCard settings={
            <div>
                {props.slider}
                <Form>
                    7 days {'   '} <Form.Switch inline id="switch7or30days" label="30 days"
                                                onChange={
                                                (e) => {
                                                switchDays(e.target.checked);
                                                console.log(e.target.checked);
                                                }}
                                                checked={daysSwitch} />
                </Form>
            </div>}
                loading={loading} title={"Attribution Rate"} tooltip={"Purchases from day x to day y"}>
            {
                averageARD.map((value, index) => {
                    {return <h5>Average AR for {value[0]} from {props.abTestData.points[props.startDate]} to {props.abTestData.points[props.endDate]}: {value[1]}</h5>}
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