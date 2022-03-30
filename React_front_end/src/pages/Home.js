import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2';


export const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => [0,10,5,5,6]),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => [7,3,2,10,9]),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const Home = () => {
/*
    useEffect(() => {

        fetch("/api/helloWorld")
            .then(
                (result) => {
                    alert(result)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    //alert(error)
                }
            )
    });
*/
    return (
        <div>
            <header>
                <h1>vb pagina</h1>
                <Row className="mx-0">
                    <Button as={Col} variant="primary">Button #1</Button>
                    <Button as={Col} variant="secondary" className="mx-2">Button #2</Button>
                    <Button as={Col} variant="success">Button #3</Button>
                </Row>
                <div style={{width: 400}}>
                    <Bar options={options} data={data}  />
                </div>

            </header>
        </div>
    );
};

export default Home;
