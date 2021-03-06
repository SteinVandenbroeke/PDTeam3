import {Button, Card, Col, Row, Form} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import LogicTable from "../logicTable";
import Slider from "../slider";


console.log("beginV24")

const ABTestInformation = (props) => {

    const navigation = useNavigate();

    const [algoLength, setAlgoLength] = React.useState(5)
    const [itemsAmount, setItemsAmount] = React.useState([3])
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [logicTableData, setLogicTableData]  = React.useState([[]]);
    const [loading, setLoading] = React.useState(true);

    const changeItemsAmount = (pm1) => {
        console.log("parameter1: " + pm1 + "   en iA= " + itemsAmount)
        setItemsAmount(pm1)
        console.log("   //parameter1: " + pm1 + "   en iA= " + itemsAmount)
        processData(props.startDate,props.endDate);
    }

    async function processData(begin, end){
        setLoading(true);
        setLogicTableData([[]])
        let allData = props.abTestData;



        Letlabels(allData.points.slice(begin, end + 1));

        let data = new Map();
        for(let algorithm in allData.algorithms){
            data[algorithm + "temp"] = new Map();
            data[algorithm] = [["place 0", -1],["place 1", -1],["place 2", -1],["place 3", -1], ["place 4", -1],["place 5", -1],["place 6", -1]];

            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                value1.mostRecomendedItems.map((valueList)=>{
                    if(!data[algorithm + "temp"].has(valueList)){
                        data[algorithm + "temp"].set(valueList, 0);
                    }
                    else{
                        data[algorithm + "temp"].set(valueList, data[algorithm + "temp"].get(valueList) + 1);
                        for(let i = 0; i < data[algorithm].length; i++){
                            if(data[algorithm][i][1] < data[algorithm + "temp"].get(valueList)){
                                data[algorithm][i] = [valueList,data[algorithm + "temp"].get(valueList)]
                                break;
                            }
                        }
                    }
                });
            });
        }

        let logicTableData = []
        let header = []
        for(let alg in allData.algorithms){
            header.push(alg)
            setAlgoLength(data[alg].length)
        }
        logicTableData.push(header);

        console.log("Showing Amount of Items: " + itemsAmount)
        for(let i = 0; i < itemsAmount; i++){
            let row = []
            for(let alg in allData.algorithms){
                row.push(data[alg][i][0])
            }
            logicTableData.push(row)
        }
        setLogicTableData(logicTableData)



        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.startDate, props.endDate]);

    return (
        <LargeInformationCard settings={
            <div>
                {props.slider}

                <Slider min={1} max={algoLength} step={1} values={itemsAmount} setValues={changeItemsAmount} />

            </div>
            }
                loading={loading} title={"Most recommended items"} tooltip={"The products that are the most recommended over the x days"}>
            <Row>
                <Col sm={12}>
                    <LogicTable data={logicTableData}/>

                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Button onClick={()=>{props.showFullList()}}>Full list</Button>
                </Col>
            </Row>
        </LargeInformationCard>
        )
};

export default ABTestInformation;
