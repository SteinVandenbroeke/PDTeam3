import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Icon from 'react-eva-icons';

const homeDashboardPage = () => {
    return (
        <div className="App">
            <header>
                <h1>Home dashboardpage</h1>
                <Link to="/dashboard/abTests" class={"btn"}>
                    <Button className={"shadow"} style={{padding: 20, margin: 20, fontSize: "2em"}} bg="primary">
                        <Icon
                            fill="#fff"
                            name="pie-chart-outline"
                            size="xlarge"
                            />
                        <br/>
                        A/B tests
                    </Button>
                </Link>
                <Link to="/dashboard/dataSets" class={"btn"}>
                    <Button className={"shadow"} style={{padding: 20, margin: 20, fontSize: "2em"}} variant="white">
                        <Icon
                            fill="#000"
                            name="list-outline"
                            size="xlarge"
                            />
                        <br/>
                        Datasets
                    </Button>
                </Link>
            </header>
        </div>
    );
};

export default homeDashboardPage;
