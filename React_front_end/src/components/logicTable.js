import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup, Table} from "react-bootstrap";
import {useContext, React, useState} from "react";
import {userSession} from "../App";
import User from "../logic/User";

const LogicTable = (props) => {
    let tableData = Array.from(props.data);
    tableData.shift();
    let header = props.data[0];
    return (
        <Table hover>
          <thead>
                <tr>
                  {header.map((value, index) => {
                    return <th key={index}>{value}</th>
                  })}
                </tr>
            </thead>
          <tbody>
            {tableData.map((valueRow) => {
                return (
                    <tr>
                    {valueRow.map((value, index) => {
                        return <td>{value}</td>
                    })}
                    </tr>)
            })}
          </tbody>
        </Table>
        )
};

export default LogicTable;
