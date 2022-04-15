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
    const [avargeARD, setavargeARD]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const graphColors = ['#0d6efd', '#84c98b', '#27292d', '#bc1ed7', '#2b2b2b', '#0c1f3d', '#84c98b']

    async function processData(begin, end){
        //TODO check if correct
        setLoading(true);
        setDatasets([]);
        setavargeARD([]);
        Letlabels([])
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let colorCounter = 0;
        for(let algorithm in allData.algorithms){
            let data = [];
            let avargeARDTemp = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                data.push(value1.ard);
                avargeARDTemp += value1.ard;
            });

            let colorGraph = graphColors[colorCounter];
            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                  backgroundColor: colorGraph,
                  borderColor: colorGraph + 80,
                }]);

            let avarge = (avargeARDTemp/props.abTestData.points.slice(begin, end + 1).length).toFixed(2);
            setavargeARD(avargeARD => [...avargeARD,
                  [algorithm, avarge]
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
        <LargeInformationCard loading={loading} title={"Attribution Rate"} tooltip={"Purchases from day x to day y"}>
            {
                avargeARD.map((value, index) => {
                    {return <h5>Avarage AR for {value[0]} from {props.abTestData.points[props.startDate]} to {props.abTestData.points[props.endDate]}: {value[1]}</h5>}
                })
            }
            {labels.length < 50 &&
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
            {labels.length >= 50 &&
                <p style={{color: "red"}}>To many datapoints to show in a graph</p>}
        </LargeInformationCard>
        )
};

export default Purchases;