import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {Spinner} from "react-bootstrap";

const ItemOverview = () => {
    const {setid, itemid} = useParams()
    const [itemData, setItemData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [itemTitle, setItemTitle] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const [metaDataList, setMetaDataList] = useState([["Property", "Value"]])



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
        console.log(itemData)
        itemData.map((item) => {
            setMetaDataList(oldDataList=>[...oldDataList,[item.dbName, item.dbValue]])
        });
        console.log(metaDataList)
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
            </div>
        </div>
    )
}

export default ItemOverview;


