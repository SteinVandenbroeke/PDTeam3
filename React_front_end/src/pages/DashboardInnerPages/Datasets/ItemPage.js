import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {Row, Spinner} from "react-bootstrap";

const ItemOverview = () => {
    const {setid, itemid} = useParams()
    const [itemData, setItemData] = useState([])
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState("https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png")
    const [itemTitle, setItemTitle] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const [metaDataList, setMetaDataList] = useState([["Property", "Value"]])



    function loadId(){
        setItemData([])
        setLoading(true)
        let getData = {
            "id": itemid,
            "table": "articles",
            "dataSet": setid
        }
        let request = new ServerRequest()
        request.sendGet("getRecordById",getData).then(requestData => {setItemData(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }


    useEffect(()=>{

        itemData.map((item) => {
            if(item.dbName === "title"){
                setItemTitle(item.dbValue)
            }
            else if(item.dbName === "description"){
                setItemDescription(item.dbValue)
            }
            else if(item.dbName === "image"){
                setImage(item.dbValue)
            }
            else{
                setMetaDataList(oldDataList=>[...oldDataList,[item.dbName, item.dbValue]])
            }
        });
    },[itemData]);



    useEffect(() => {
        loadId()
    },[]);

    return (
        <div>
            <div style={{padding: 10, textAlign:"left"}}>
                <div>
                        <img src={image} alt={itemTitle} />
                </div>
            </div>
                <Row>
                    <b>Name:</b> {itemTitle}
                </Row>
                <Row>
                    <b>Description:</b> {itemDescription}
                </Row>
            <div>
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
    )
}

export default ItemOverview;


