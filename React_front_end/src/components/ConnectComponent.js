import { useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Position } from 'react-flow-renderer';
import {Col, Row, Table, Button, Form, ProgressBar, Card} from "react-bootstrap";

import '../styles/connectComponent.css';


const ConnectComponent = (props) => {
  function fromNode(id, title, possitionY){
    return {
      id: id.toString(),
      type: 'output',
      data: {label: title},
      position: {x: 0, y: possitionY},
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
    };
  }

  function toNode(id, title, possitionY){
    return {
      id: id.toString(),
      type: 'input',
      data: {label: title},
      position: {x: 200, y: possitionY},
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
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
    nodeData.cvs.map((value, index) => {
        allNodes.push(toNode(indexCounter, value,heigtCounter));
        heigtCounter += 50;
        indexCounter += 1;
    })

    return allNodes;
  }



  let defaultNodes = generateNodes(props.data);
  let initialEdges = [

  ];
  return (
      <ReactFlow style={{height: 500}}  nodes={defaultNodes} defaultEdges={initialEdges} className="touchdevice-flow" fitView>
        <Controls/>
      </ReactFlow>
  );
}

export default ConnectComponent;