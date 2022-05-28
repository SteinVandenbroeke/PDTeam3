import {Button, Col, Form, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import { Range } from 'react-range';
import {Line} from "react-chartjs-2";

const SmoothingLineCard = (props) => {
    const [data, setData] = React.useState([]);
    const [labels, setLabels] = React.useState([]);

    async function smoothing(){
        console.log("smoothing")
        let windowSmootingSize = parseInt(props.smoothingWindow)
        if(windowSmootingSize <= 0){
            return
        }
        let newLabels = []
        console.log("object to json to object");
        let dataCp = JSON.parse(JSON.stringify(props.data));
        console.log("object to json to object klaar");
        for(let i = 0; i < dataCp.length; i++){
            dataCp[i].data = [];
        }
        for(let i = 0; i < props.labels.length; i += windowSmootingSize){
            newLabels.push(props.labels[i + Math.floor((windowSmootingSize/2))])

            for (let a = 0; a < props.data.length; a++) {
                let total = 0;
                let totalCount = 0;
                for(let b = 0; b < windowSmootingSize; b++){
                    if(i + b < props.data[a].data.length){
                        total += props.data[a].data[i + b]
                        totalCount++;
                    }
                }
                dataCp[a].data.push(total/totalCount);
            }
        }
        console.log("done")
        setLabels(newLabels);
        setData(dataCp);
    }

    useEffect(() => {
        setData(props.data);
        setLabels(props.labels);
        console.log(props.smoothingWindow)
        if(props.data !== null && props.data !== undefined && props.data !== [] && props.smoothingWindow !== 0 && props.smoothingWindow != "0"){
            console.log("smooting" + props.smoothingWindow)
            smoothing().then(r => console.log("jeeej"));
        }
    }, [props.smoothingWindow,props.data]);

    return (
        <div>
            <Line height={props.height} options={props.options}
            data={{
              labels: labels, datasets: data
            }} />
        </div>
    )
};

export default SmoothingLineCard;
