import React from 'react';
import {useParams} from "react-router-dom";
import Accordion from "../../../components/Accordion";
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";

const ItemOverview = () => {
    const {setid, itemid} = useParams()
    //Voorlopig template later opgevraagd vanuit database met setid en itemid
    const itemData = {"itemID" : "1234", "name" : "Template Item", "url" : "https://media.wired.com/photos/5ffcd2ef7576555735fb9eae/master/pass/Culture_heatedclothing_AH-WTOP-5V-B_11.jpg",
        "metadata" : { "Color" : "Blue", "Pattern" : "Checker Board", "Pattern Color": "Black", "Feature": "In-heated", "Production Year": "2020", "Power": "100 W"},
        "recommendations" : [
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "12-4-2022", "num_of_rec" : "12", "num_of_suc_rec" : "6"},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "13-4-2022", "num_of_rec" : "22", "num_of_suc_rec" : "11"},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "14-4-2022", "num_of_rec" : "23", "num_of_suc_rec" : "13"},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "15-4-2022", "num_of_rec" : "7", "num_of_suc_rec" : "5"},
            {"test" : "ABtest0", "algorithm" : "Popularity", "timestamp" : "16-4-2022", "num_of_rec" : "18", "num_of_suc_rec" : "6"}
        ]}
    const metaDataList = [["Property", "Value"]];

    for (const key in itemData["metadata"]) {
        if (itemData["metadata"].hasOwnProperty(key)) {
            const entry=[key, itemData["metadata"][key]]
            metaDataList.push(entry)
        }
    }

    const metaDataTable = <LogicTable data={metaDataList} />

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{flex:0.2}}>
                    <figure className="shadow">
                        <img src={itemData["url"]} alt={itemData["name"]} />
                        <figcaption>{itemData["name"]}</figcaption>
                    </figure>
                </div>
                <div style={{padding: 10, flex:0.2, textAlign:"left"}}>
                    <b>Name:</b> {itemData["name"]}
                </div>
                <div style={{flex:0.6}}>
                    <Accordion title="Metadata" data={metaDataTable} width={600} />
                </div>
            </div>
        </div>
    )
}

export default ItemOverview;