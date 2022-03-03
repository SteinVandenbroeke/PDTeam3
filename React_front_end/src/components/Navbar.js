import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card, Image} from "react-bootstrap";
import {useContext, React} from "react";
import {userSession} from "../App";
import ProfileImageMenu from "./profileImageMenu";

const NavbarComp = () => {

    let usersession = useContext(userSession);
    function logout(){
        usersession.user.logout().then(()=>{
            window.location.reload();
        });
    }

    return (
        <>
            <Navbar collapseOnSelect bg="light" expand="lg" className={"shadow-lg"}>
                <Container>
                    <Navbar.Brand href="#home">Project DB</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link to="/"><Link to="/dashboard" class={"btn"}>Dashboard</Link></Nav.Link>
                            <Nav.Link to="/page2"><Link to="/users" class={"btn"}>Users</Link></Nav.Link>
                            <div className={"d-none d-lg-block"} style={{paddingLeft: 10, zIndex: 99}}>
                                <ProfileImageMenu/>
                            </div>
                            <div className={"d-lg-none"}>
                                <Nav.Link to="/settings"><Link to="/settings" class={"btn"}>Settings</Link></Nav.Link>
                                <Nav.Link><div onClick={()=>logout()} class={"btn"}>Logout</div></Nav.Link>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </>
    )
};

export default NavbarComp;
