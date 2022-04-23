import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import DateTimePicker from 'react-datetime-picker';
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";
import LogicTable from "../../../components/logicTable";
import {Spinner} from "react-bootstrap";

const PersonOverview = () => {
    const {setid, personid} = useParams();
    const [personData, setPersonData] = useState([{"dbName": "id", "dbValue": 0}]);
    const [loading, setLoading] = useState(false);

    const [metaDataList,setMetaDataList] = useState([["Property", "Value"]]);

    //static
    const [selectedAlgo, setSelectedAlgo] = useState("Popularity");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const recItems = []
    const personDataStatic = {
        "history" : [{"itemID" : "1452", "time_stamp" : "12-4-2022"}, {"itemID" : "1754", "time_stamp" : "17-4-2022"},],
        "recommendations" : [
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "13-4-2022", "rec_list" : ["1452", "1447", "7841"]},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "14-4-2022", "rec_list" : ["8957", "5421", "7841"]},
        ]
    }



    function toDayString(d){
        if (d instanceof Date){
            return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
        } else { return "Not a Date."}
    }

    function loadId(){
        console.log(setid)
        setLoading(true);
        let getData = {
            "id": personid,
            "table": "customers",
            "dataSet": setid
        }
        let request = new ServerRequest();
        request.sendGet("getRecordById",getData).then(requestData => {setPersonData(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }



    useEffect(()=>{
        personData.map((item) => {
            console.log(item.dbName)
            if(item.dbName !== "id"){
                console.log(item.dbName)
                setMetaDataList(oldDataList=>[...oldDataList,[item.dbName, item.dbValue]])
                console.log(metaDataList)
            }
        });
    },[personData]);

    useEffect(() => {
        loadId()
    },[]);




    for (const key1 in personDataStatic["recommendations"]){
        if (personDataStatic["recommendations"][key1]["algorithm"] === selectedAlgo &&
            personDataStatic["recommendations"][key1]["timestamp"] === toDayString(selectedDate)){
            for (const key2 in personDataStatic["recommendations"][key1]["rec_list"]){
                const id = personDataStatic["recommendations"][key1]["rec_list"][key2]
                recItems.push(<ItemCard name={id} id={id} setid={setid}/>)
            }
        }
    }
    const histItems = personDataStatic["history"].map((d) => <ItemCard name={d.itemID} desc={d.time_stamp} id={d.itemID} setid={setid}/>);

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", padding: 20}}>
                <div style={{paddingLeft: 20, flex:0.1, textAlign:"left"}}>
                    <b>ID:</b> {personid}
                </div>
                <div style={{flex:0.2, textAlign:"left"}}>
                    <select value={selectedAlgo} onChange={e=>setSelectedAlgo(e.target.value)}>
                        <option>Popularity</option>
                        <option>Recency</option>
                        <option>ItemKNN</option>
                    </select>
                </div>
                <div style={{flex:0.7, textAlign:"left"}}>
                    <DateTimePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
            </div>
            <Accordion title={"Recommendations"} data={recItems}>
                <Spinner
                    className={!loading? "visually-hidden": ""}
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Accordion>
            <Accordion title={"History"} data={histItems}>
                <Spinner
                    className={!loading? "visually-hidden": ""}
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Accordion>
            <Accordion title={"MetaData"} data={<LogicTable data={metaDataList} />}>
                <Spinner
                    className={!loading? "visually-hidden": ""}
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Accordion>
        </div>
    )

}

export default PersonOverview;