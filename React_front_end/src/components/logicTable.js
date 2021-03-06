import {Table, Button} from "react-bootstrap";
import {useState, useEffect} from "react";
import Icon from "react-eva-icons";

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
    const [currentSortparam, setCurrentSortParam] = useState(0)
    const [currentSortHighest, setCurrentSortHighest] = useState(false)
    const [tableIndex, setTableIndex] = useState(0)
    //let header = props.data[0];
    let action = props.action;


    function sortOnParameter(parameter) {
        let currentPar = currentSortparam
        let currectHighest = currentSortHighest
        if (currentPar === parameter) {
            currectHighest = !currectHighest
        } else {
            currentPar = parameter
            currectHighest = true
        }
        let temp = tableData.sort(function (a, b) {
            let comparevalue = 1
            if (currectHighest === true) {
                comparevalue = -1
            }
            if (a[parameter] > b[parameter]) {
                return comparevalue;
            } else {
                return -comparevalue;
            }
        });
        setCurrentSortHighest(currectHighest)
        setCurrentSortParam(currentPar)
        setTableData([])
        setTableData(oldData => [...oldData, ...temp])
    }

    useEffect(() => {
        if(props.tableIndex > 0){
            setTableIndex(props.tableIndex)
        }
        if (props.data[0].length === 0) {
            return;
        }
        let temp = Array.from(props.data)
        setTableData(temp)
        setHeader(temp.shift());
    }, [props.data]);

    useEffect(() => {
        setDisplayData([])
        let temp = tableData.slice(0, dataLimit)
        setDisplayData(oldData => [...oldData, ...temp])
    }, [dataLimit, tableData]);


    return (
        <>
            <Table hover responsive striped>
                <thead>
                <tr>
                    {header.map((value, index) => {
                        return <th style={{cursor: "pointer"}} onClick={() => sortOnParameter(index)}
                                   key={index}>{value} {(index===currentSortparam) && currentSortHighest && <div style={{display:"inline-block"} }><Icon fill={"black"} name={"arrow-ios-upward-outline"}/></div>}
                        {(index===currentSortparam) && !currentSortHighest && <div style={{display:"inline-block"} }><Icon fill={"black"} name={"arrow-ios-downward-outline"}/></div>}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {displayData.map((valueRow) => {
                    let idForFunction = valueRow[tableIndex];
                    return (
                        <tr
                            // defining what happens when this component gets clicked
                            onClick={() => action(idForFunction)} style={{cursor: "pointer"}}>
                            {valueRow.map((value, index) => {
                                return <td>{value}</td>
                            })}
                        </tr>)
                })}
                </tbody>
            </Table>
            {dataLimit < tableData.length &&
                <Button variant="primary" onClick={() => setDataLimit(dataLimit + 40)}>Load More</Button>}
        </>
    )
};

export default LogicTable;
