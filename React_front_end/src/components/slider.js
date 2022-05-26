import {Button, Col, Form, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Range } from 'react-range';
import SliderSkeleton from "./loadingSkeletons/sliderSkeleton";

const Slider = (props) => {
    let [labels , setLabels] = useState(null);
    let [startProcent , setStartProcent] = useState(0);
    let [endProcent , setEndProcent] = useState(0);

    function updateLabels(){
        if(props.labels === undefined || props.labels === null) {
            let labelsTemp = Array(props.max).fill().map((_, idx) => (idx).toString())
            setLabels(labelsTemp);
        }
        else
        {
            setLabels(props.labels);
        }
    }

    function updateColor(){
        if(props.values.length > 1){
            setStartProcent((props.values[0] / props.max) * 100);
            setEndProcent((props.values[1] / props.max) * 100);
        }
        else {
            setStartProcent(0);
            setEndProcent((props.values[0] / props.max) * 100);
        }
    }

    useEffect(() => {
        updateLabels();
    },[props.labels, props.max, props.min]);

    useEffect(() => {
        updateColor();
    },[props.values, props.max, props.min]);

    if(labels == null){
        return(
          <SliderSkeleton loading={true}></SliderSkeleton>
        );
    }

    return (
        <Row style={{paddingTop: 20}}>
            <Col sm={2}>
                {props.values.length == 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[props.values[0]]} onChange={(e)=>{props.setValues([labels.indexOf(e.target.value)])}} />}
                {props.values.length > 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[props.values[0]]} onChange={(e)=>{props.setValues([labels.indexOf(e.target.value), props.values[1]])}} />}
            </Col>
            <Col sm={8}>
                <Range
                    values={props.values}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    onChange={(values) => props.setValues(values)}
                    onFinalChange={(values) => {try{props.onFinalChange()}catch{}}}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: '36px',
                          display: 'flex',
                          width: '100%'
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: '5px',
                            width: '100%',
                            borderRadius: '4px',
                            background: 'linear-gradient(90deg, rgba(204,204,204,1) 0%, rgba(204,204,204,1) ' + startProcent.toString() + '%, rgba(84,139,244,1) ' + startProcent.toString() + '%, rgba(84,139,244,1) ' + endProcent.toString() + '%, rgba(204,204,204,1) ' + endProcent.toString()+ '%, rgba(204,204,204,1) 100%)',
                              alignSelf: 'center'
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                    renderThumb={({ index, props, isDragged }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '20px',
                          width: '20px',
                          borderRadius: '100%',
                          backgroundColor: '#FFF',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0px 2px 6px #AAA',
                            borderWidth: '0px',
                            outline: 0
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-35px',
                            color: '#000',
                            fontSize: '14px',
                            padding: '2px',
                            borderRadius: '5px',
                            backgroundColor: '#fff',
                          }}
                        >
                          {
                              labels == null && props.values != undefined  && props.values[index].toFixed(1)

                          }
                          {
                              labels != null && props.values != undefined && labels[props.values[index].toFixed(0)]
                          }

                        </div>
                        <div
                          style={{
                            height: '12px',
                            width: '12px',
                            borderRadius: '100%',
                            backgroundColor: isDragged ? '#548BF4' : '#CCC'
                          }}
                        />
                      </div>
                    )}
                />
            </Col>
            <Col sm={2}>
                {props.values.length > 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[props.values[1]]} onChange={(e)=>{props.setValues([props.values[0], labels.indexOf(e.target.value)])}} />}
            </Col>
        </Row>
    )
};

export default Slider;
