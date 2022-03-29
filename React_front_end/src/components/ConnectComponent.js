import {useCallback, useEffect, useState} from 'react';
import ReactFlow, { MiniMap, Controls, Position } from 'react-flow-renderer';
import {Col, Row, Table, Button, Form, ProgressBar, Card, Tab, Tabs} from "react-bootstrap";

import '../styles/connectComponent.css';


const ConnectComponent = (props) => {


  useEffect(() => {
      if(nodes.length !== props.data.database.length + props.data.csv.length){
          console.log("test", props.data);
          let nodeSet = generateNodes(props.data);
          setNodes(nodeSet);
      }
    }, [props.data, props.data.csv]);

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
  let [nodes , setNodes] = useState([]);

  function onConnect(e){
      newConnection(e.source, e.target);
  }

  function newConnectionText(value){
      console.log(value);
      let source = value.split("-")[0];
      let target = value.split("-")[1];
      newConnection(source, target)
  }

  function newConnection(from, to){
    let currentData = props.data;
    currentData.connections[currentData.csv[parseInt(to) - currentData.database.length]] = currentData.database[parseInt(from)];

    let tempEdges = []
    console.log(currentData.connections);
    Object.entries(currentData.connections).map(([key,value]) => {
        let to =  currentData.csv.findIndex(item => item === key)  + currentData.database.length;
        let from = currentData.database.findIndex(item => item === value);
        tempEdges.push({ id: 'e' + from  + '-' + to + '', source: from.toString(), target: to.toString() });
    });
    setEdges(tempEdges);

    props.dataSetFunction(currentData);
  }

  return (
      <Tabs defaultActiveKey="graph" id="uncontrolled-tab-example" style={{width: "100%"}}>
          <Tab eventKey="graph" title="Graphical">
             <ReactFlow style={{height: 500}}  nodes={nodes} onConnect={onConnect} edges={edges} className="touchdevice-flow" fitView>
                <Controls/>
              </ReactFlow>
          </Tab>
          <Tab eventKey="text" title="Text" style={{margin: 10, marginBottom: 40}}>
              {

                  props.data.csv.map((value, index) => {
                      return (
                      <Form.Group className="mb-3">
                        <Form.Label>{value}</Form.Label>
                        <Form.Select onChange={(e)=>newConnectionText(e.target.value)} aria-label="Default select example">
                          <option>Open this select menu</option>
                            {props.data.database.map((value1, index1) => {
                                return (<option value={index1 + "-" + (index + props.data.database.length)}>{value1}</option>);
                            })}
                        </Form.Select>
                      </Form.Group>)
                  })
              }
          </Tab>
      </Tabs>
  );
}

export default ConnectComponent;