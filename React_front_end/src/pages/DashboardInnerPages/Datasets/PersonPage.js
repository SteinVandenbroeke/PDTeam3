import React from 'react';
import {useParams} from "react-router-dom";

const PersonOverview = () => {
    const {personid} = useParams();
    return (
        <div>
            {personid}
        </div>
    )
}

export default PersonOverview;