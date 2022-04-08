import React from 'react';
import {useParams} from "react-router-dom";

const ItemOverview = () => {
    const {itemid} = useParams()
    return (
        <div>
            {itemid}
        </div>
    )
}

export default ItemOverview;