import {useCallback, useState} from 'react';
import ReactFlow, { MiniMap, Controls, Position } from 'react-flow-renderer';
import {Col, Row, Table, Button, Form, ProgressBar, Card} from "react-bootstrap";

import '../styles/connectComponent.css';


const ConnectComponent = (props) => {
  function fromNode(id, title, possitionY){
    return {
      id: id.toString(),
      type: 'input',
      data: {label: title},
      position: {x: 0, y: possitionY},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  }

  function toNode(id, title, possitionY){
    return {
      id: id.toString(),
      type: 'output',
      data: {label: title},
      position: {x: 200, y: possitionY},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  }

  function generateNodes(nodeData){
    let allNodes = [];
    let heigtCounter = 0;
    let indexCounter = 0;
    nodeData.database.map((value, index) => {
        allNodes.push(fromNode(indexCounter, value,heigtCounter));
        heigtCounter += 50;
        indexCounter += 1;
    });

    heigtCounter = 0;
    nodeData.csv.map((value, index) => {
        allNodes.push(toNode(indexCounter, value,heigtCounter));
        heigtCounter += 50;
        indexCounter += 1;
    })

    return allNodes;
  }


  let [edges , setEdges] = useState([]);

  function onConnect(e){
    console.log(e);
    alert("test", e);
    let currentData = props.data;
    currentData.connections[currentData.database[parseInt(e.source)]] = currentData.csv[parseInt(e.target) - currentData.database.length];
    console.log(currentData);
    props.dataSetFunction(currentData);
  }

  let defaultNodes = generateNodes(props.data);
  return (
      <ReactFlow style={{height: 500}}  nodes={defaultNodes} onConnect={onConnect} defaultEdges={edges} className="touchdevice-flow" fitView>
        <Controls/>
      </ReactFlow>
  );
}

export default ConnectComponent;