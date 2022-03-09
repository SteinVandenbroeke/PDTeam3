import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image, ListGroup} from "react-bootstrap";
import {useContext, React, useState} from "react";
import {userSession} from "../App";
import User from "../logic/User";
import Icon from "react-eva-icons";

const ProfileImageMenu = () => {

    let usersession = useContext(userSession);
    function logout(){
        usersession.user.logout().then(()=>{
            window.location.reload();
        });
    }

    let [showMenu , setShowMenu] = useState(false);

    return (
        <>
            <Image onClick={()=>{setShowMenu(!showMenu)}} roundedCircle={true} height={50} src={"https://scontent.fbru1-1.fna.fbcdn.net/v/t1.6435-9/78431746_2293299950961562_7867165954851995648_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=UpMJOOQDA7EAX-FFLhh&_nc_ht=scontent.fbru1-1.fna&oh=00_AT--woVzrD7i2DiqMtz8n0KS3O0dvV2-8lG7QUWQde11eQ&oe=624621AC"}></Image>
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
