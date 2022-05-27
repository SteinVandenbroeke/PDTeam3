import {Button, Form} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';
import SmoothingLineCard from "../smoothingLineChar";


const Purchases = (props) => {
    const navigation = useNavigate();
    const [daysSwitch, setDaysSwitch] = React.useState(false) // false = 7 dagen
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [averageARD, setaverageARD]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showAllDataPoints, setShowAllDataPoints] = React.useState(false);
    const graphColors =  ['#84c98b', '#ED5C77', '#bc1ed7', '#0c1f3d', '#D4A418', '#00AAB5', '#D9730C', '#A7AABD','#328984']

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
                }
                else{
                    value = value1.ard30
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
                  ["alg id " + algorithm, average]
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
    }, [props.abTestData, props.startDate, props.endDate, daysSwitch]);

    return (
        <LargeInformationCard settings={
            <div>
                {props.slider}
                <Form>
                    7 days {'   '} <Form.Switch inline id="switch7or30days" label="30 days"
                                                onChange={(e) => {setDaysSwitch(e.target.checked);}}
                                                checked={daysSwitch} />
                </Form>
            </div>}
                loading={loading} title={"Attribution Rate"} tooltip={"Purchases from day x to day y"}>
            {
                averageARD.map((value, index) => {
                    {return <h5>Average AR for {value[0]} in interval: {value[1]}</h5>}
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