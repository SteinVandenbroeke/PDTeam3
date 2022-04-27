import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Card, Container, ListGroup, Form, Button,Spinner} from "react-bootstrap";
import LogicTable from "../../components/logicTable";
import {Link} from "react-router-dom";
import Icon from "react-eva-icons";
import {toast} from "react-toastify";
import {ServerRequest} from "../../logic/ServerCommunication";

const UserList = () => {
    const [loading, setLoading] = useState(false);

    function deleteUser(username){
        let request = new ServerRequest();
        let getData = {
            "userName": username,
        }
        request.sendGet("deleteUser",getData).then(message => {toast.success(message.message); loadUsers()}).catch(error => {toast.error(error.message); setLoading(false)});
    }


    let Permission= (<Form.Check
        type="switch"
        id="Permission-switch"
    />);

    const [userData,setUserData] = useState([])
    const [TableData, setTableData] = useState([["UserName","First Name", "Last Name","Date of Birth", "Admin Permissions",""]])


    function loadUsers(){
        setTableData([["UserName","First Name", "Last Name","Date of Birth", "Admin Permissions",""]])
        setUserData([])
        setLoading(true);
        let request = new ServerRequest();
        request.sendGet("getUsers").then(requestData => {setUserData(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    useEffect(() => {
        for(var i = 0; i < userData.length; i++){
            let temp = userData[i]
            let Delete=(
                <Button onClick={()=>deleteUser(temp[0])} variant="outline-danger"><Icon
                    fill="#dc3545"
                    name="trash-2-outline"
                /></Button>
            );
            temp.push(Delete)
            setTableData(oldData=>[...oldData,temp])
        }
    },[userData]);

    useEffect(() => {
        loadUsers()
    },[]);

    return (
        <div className="App">
            <h1>Users</h1>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/Users/add" class={"btn"}>
                    <Button variant="primary">Add new user <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable data={TableData}/>
        </div>
    );
};

export default UserList;