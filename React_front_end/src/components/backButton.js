import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigation = useNavigate();
    return (
        <Button style={{position: "absolute", left: 5, top: 5}} variant="" onClick={() => {navigation(-1);}}>
            <Icon
            fill="#000"
            name="arrow-ios-back-outline"
            size="medium"
            />
            Back
        </Button>
        )
};

export default BackButton;
