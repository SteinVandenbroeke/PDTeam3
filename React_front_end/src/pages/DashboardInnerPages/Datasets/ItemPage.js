import React from 'react';
import {useParams} from "react-router-dom";

const ItemOverview = () => {
    const {setid, itemid} = useParams()
    return (
        <div>
            {itemid} from dataset {setid}
        </div>
    )
}

export default ItemOverview;