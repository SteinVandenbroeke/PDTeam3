import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import { Range } from 'react-range';

const DoubleSlider = (props) => {
    let values = props.values;
    let setValues = props.setValues;
    return (
            <Range
        values={values}
        step={props.step}
        min={props.min}
        max={props.max}
        onChange={(values) => setValues(values)}
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
                backgroundColor: '#ccc',
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
              {values[index].toFixed(1)}
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
    )
};

export default DoubleSlider;
