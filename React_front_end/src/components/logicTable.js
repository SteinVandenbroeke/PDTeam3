import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup, Table} from "react-bootstrap";
import {useContext, React, useState} from "react";
import {userSession} from "../App";
import User from "../logic/User";

const LogicTable = (props) => {

    return (
        <Table hover>
          <thead>
                <tr>
                  {props.data[0].map((value, index) => {
                    return <th key={index}>{value}</th>
                  })}
                </tr>
            </thead>
          <tbody>

            {props.data.map((valueRow) => {
                return (<tr>
                    {valueRow.map((value, index) => {
                        return (
                          <td>{value}</td>)
                    })}
                    </tr>)
            })}
          </tbody>
        </Table>
        )
};

export default LogicTable;
