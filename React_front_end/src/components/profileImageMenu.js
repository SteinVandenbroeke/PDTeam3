import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup} from "react-bootstrap";
import {useContext, React, useState, useEffect} from "react";
import {userSession} from "../App";
import User from "../logic/User";
import Icon from "react-eva-icons";
import {toast} from "react-toastify";
import {ServerRequest} from "../logic/ServerCommunication";

const ProfileImageMenu = () => {

    let usersession = useContext(userSession);
    function logout(){
        usersession.user.logout().then(()=>{
            window.location.reload();
        });
    }

    function loadProfileImage(){
        let request = new ServerRequest();
        request.sendGet("getCurrentUserInformation").then(requestData => {setImage("/profileImages/" + requestData.profilePicture)}).catch(error => {toast.error(error.message); logout();});
    }

    let [showMenu , setShowMenu] = useState(false);
    let [image , setImage] = useState("https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/menu.png");

    useEffect(() => {
        loadProfileImage()
    },[]);


    return (
        <>
            <Image onClick={()=>{setShowMenu(!showMenu)}} roundedCircle={true} height={50} src={image}></Image>
            {showMenu &&
                <>
                    <div style={{height: "100vh", width: "100%", position: "absolute", left: 0, top:0}} onClick={()=>{setShowMenu(false)}}/>
                    <Card className={"shadow-lg"} style={{ width: '18rem', position: "absolute", top: 60}}>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item action >
                              <Icon
                                    fill="#000000"
                                    name="settings-outline"
                              />
                              Settings
                          </ListGroup.Item>
                          <ListGroup.Item action  onClick={()=>{logout();}}>
                              <Icon
                                fill="#000000"
                                name="log-out-outline"
                              />
                              Logout
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                </>

            }
        </>
        )
};

export default ProfileImageMenu;
