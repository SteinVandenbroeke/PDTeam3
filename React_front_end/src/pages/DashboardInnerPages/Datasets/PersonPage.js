import React from 'react';
import {useParams} from "react-router-dom";

const PersonOverview = () => {
    const {setid, personid} = useParams();
    return (
        <div>
            {personid} from dataset {setid}
        </div>
    )
}

export default PersonOverview;