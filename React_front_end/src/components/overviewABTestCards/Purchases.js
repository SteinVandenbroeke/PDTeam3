import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';
import SmoothingLineCard from "../smoothingLineChar";

const Purchases = (props) => {
    const navigation = useNavigate();
    const [labels, letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [totalPurchases, setTotalPurchases]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const graphColors = ['#84c98b', '#27292d', '#bc1ed7', '#2b2b2b', '#0c1f3d', '#84c98b']
    async function processData(begin, end){
        setLoading(true);
        setDatasets([]);
        setTotalPurchases([])
        let allData = props.abTestData;

        letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let totalPurch = 0;
        allData.NotAlgDependent.slice(begin, end + 1).map((value, index) =>{
                    data.push(value.Purchases);
                    totalPurch += value.Purchases;
                });

        setTotalPurchases(totalPurchases => [...totalPurchases,
                  ["Total", totalPurch]
                ]);

        setDatasets(datasets => [...datasets, {
                  label: "Purchases",
                  data: data,
                }]);


        let colorCounter = 0;
        for(let algorithm in allData.algorithms){
            let data = [];
            let totalPurch = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                data.push(value1.purchases);
                totalPurch += value1.purchases;
            });

            let colorGraph = graphColors[colorCounter];
            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                  backgroundColor: colorGraph,
                  borderColor: colorGraph + 80,
                }]);

            setTotalPurchases(totalPurchases => [...totalPurchases,
                  [algorithm, totalPurch]
                ]);
            colorCounter++;
            if(colorCounter >= graphColors.length){
                colorCounter = 0;
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate, props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard settings={props.slider} loading={loading} title={"Purchases"} tooltip={"Purchases from day x to day y"}>
            <h5>
                {
                    totalPurchases.map((value, index) => {
                        {return <h5>Purchases for {value[0]} from {props.abTestData.points[props.startDate]} to {props.abTestData.points[props.endDate]}: {value[1]}</h5>}
                    })
                }
            </h5>
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

export default Purchases;