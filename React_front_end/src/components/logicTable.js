import {Outlet, Link} from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup, Table, Button} from "react-bootstrap";
import {useContext, React, useState, useEffect} from "react";
import {userSession} from "../App";
import User from "../logic/User";

/**
 *
 * @param props.data
 * @returns {JSX.Element}
 * @constructor
 */
const LogicTable = (props) => {
    const [tableData, setTableData] = useState([]);
    const [header, setHeader] = useState([]);
    const [dataLimit, setDataLimit] = useState(40);
    const [displayData, setDisplayData] = useState([])
    //let header = props.data[0];
    let action = props.action;

    function sortOnParameter(parameter) {
        let temp = tableData.sort(function (a, b) {
            if (a[parameter] > b[parameter]) {
                return -1;
            } else {
                return 1;
            }
        });
        setTableData([])
        setTableData(oldData => [...oldData, ...temp])
    }

    useEffect(() => {
        if (props.data[0].length === 0) {
            return;
        }
        let temp = Array.from(props.data)
        setTableData(temp)
        setHeader(temp.shift());
        console.log(dataLimit,tableData.length)
    }, [props.data]);

     useEffect(() => {
         setDisplayData([])
         let temp = tableData.slice(0,dataLimit)
         setDisplayData(oldData => [...oldData,...temp])
         console.log(displayData, dataLimit)
     }, [dataLimit,tableData]);

    return (
        <>
            <Table hover responsive striped>
                <thead>
                <tr>
                    {header.map((value, index) => {
                        return <th style={{cursor: "pointer"}} onClick={() => sortOnParameter(index)}
                                   key={index}>{value}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {displayData.map((valueRow) => {
                    let idForFunction = valueRow[0];
                    return (
                        <tr onClick={() => action(idForFunction)} style={{cursor: "pointer"}}>
                            {valueRow.map((value, index) => {
                                return <td>{value}</td>
                            })}
                        </tr>)
                })}
                </tbody>
            </Table>
            {dataLimit < tableData.length  && <Button variant="primary" onClick={()=>setDataLimit(dataLimit+40)}>Load More</Button>}
        </>


    )
};

export default LogicTable;
