import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup, Table} from "react-bootstrap";
import {useContext, React, useState} from "react";
import {userSession} from "../App";
import User from "../logic/User";

const LogicTable = () => {
    return (
        <Table hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Dataset name</th>
              <th>Created by</th>
              <th>Creation date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>H&M test dataset 1</td>
              <td>Stein</td>
              <td>08-03-2022 21:20</td>
            </tr>
            <tr>
              <td>2</td>
              <td>H&M test dataset 2</td>
              <td>Stein</td>
              <td>08-03-2022 21:22</td>
            </tr>
          </tbody>
        </Table>
        )
};

export default LogicTable;
