import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import DateTimePicker from 'react-datetime-picker';

function toDayString(d){
    if (d instanceof Date){
        return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    } else { return "Not a Date."}
}

const PersonOverview = () => {
    const {setid, personid} = useParams();
    const [selectedAlgo, setSelectedAlgo] = useState("Popularity");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const personData = {"personID" : "9999",
        "history" : [{"itemID" : "1452", "time_stamp" : "12-4-2022"}, {"itemID" : "1754", "time_stamp" : "17-4-2022"},],
        "recommendations" : [
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "13-4-2022", "rec_list" : ["1452", "1447", "7841"]},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "14-4-2022", "rec_list" : ["8957", "5421", "7841"]},
        ]
    }

    const recItems = []

    for (const key1 in personData["recommendations"]){
        if (personData["recommendations"][key1]["algorithm"] === selectedAlgo &&
            personData["recommendations"][key1]["timestamp"] === toDayString(selectedDate)){
            for (const key2 in personData["recommendations"][key1]["rec_list"]){
                const id = personData["recommendations"][key1]["rec_list"][key2]
                recItems.push(<ItemCard name={id} id={id} setid={setid}/>)
            }
        }
    }

    const histItems = personData["history"].map((d) => <ItemCard name={d.itemID} desc={d.time_stamp} id={d.itemID} setid={setid}/>);

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", padding: 20}}>
                <div style={{paddingLeft: 20, flex:0.1, textAlign:"left"}}>
                    <b>ID:</b> {personData["personID"]}
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
            <Accordion title={"Recommendations"} data={recItems} />
            <Accordion title={"History"} data={histItems} />
        </div>
    )
}

export default PersonOverview;