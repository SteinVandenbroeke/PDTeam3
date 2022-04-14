import {Button, Card, Col, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import LogicTable from "../logicTable";

const ABTestInformation = (props) => {
    const navigation = useNavigate();

    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [avargeCTR, setavargeCTR]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    async function processData(begin, end){
        setLoading(true);
        setDatasets([]);
        setavargeCTR([]);
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = {};
        for(let algorithm in allData.algorithms){
            let avargeCTRTemp = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                value1.mostRecomendedItems.map((valueList)=>{
                    if(!data.has(algorithm)){
                        data[algorithm] = 0;
                    }
                    data[algorithm] = data[algorithm]+1;
                });
            });
        }
        console.log(data);
        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate]);

    return (
        <LargeInformationCard title={"ABTest Information"} tooltip={"Information about this ABTest"}>
              <Row>
                  <Col sm={8}>

                  </Col>
              </Row>
        </LargeInformationCard>
        )
};

export default ABTestInformation;
