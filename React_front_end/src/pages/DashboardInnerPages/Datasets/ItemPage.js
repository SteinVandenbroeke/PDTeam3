import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";

const ItemOverview = () => {
    const {setid, itemid} = useParams()
    const [itemData, setItemData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [itemTitle, setItemTitle] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const metaDataList = [["Property", "Value"]];

    const metaDataTable = <LogicTable data={metaDataList} />

    function loadId(){
        setItemData([])
        setLoading(true);
        let getData = {
            "id": itemid,
            "table": "articles",
            "dataSet": setid
        }
        let request = new ServerRequest();
        request.sendGet("getRecordById",getData).then(requestData => {setItemData(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    useEffect(()=>{
        itemData.map((item) => {
            if(item.dbName === "title"){
                setItemTitle(item.dbValue);
            }
            else if(item.dbName === "description"){
                setItemDescription(item.dbValue);
            }
            else{
                metaDataList.push([item.dbName, item.dbValue])
            }
        });
    },[itemData]);

    useEffect(() => {
        loadId()
    },[]);

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{padding: 10, flex:0.2, textAlign:"left"}}>
                    <div style={{flex:0.2}}>
                            <img src={"https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png"} alt={itemTitle} />
                    </div>
                </div>
                    <b>Name:</b> {itemTitle}
                    <br/>
                    <b>Description:</b> {itemDescription}
                <div style={{flex:0.6}}>
                    <Accordion title="Metadata" data={metaDataTable} width={600} />
                </div>
            </div>
        </div>
    )
}

export default ItemOverview;


