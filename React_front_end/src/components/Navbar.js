import { Outlet, Link } from "react-router-dom";
import {Navbar, Container, Nav, Card} from "react-bootstrap";

const NavbarComp = () => {
    return (
        <>
            <Navbar bg="light" expand="lg" className={"shadow-lg"}>
                <Container>
                    <Navbar.Brand href="#home">Project DB</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link to="/"><Link to="/" class={"btn"}>Home</Link></Nav.Link>
                            <Nav.Link to="/page2"><Link to="/page2" class={"btn"}>Page2</Link></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </>
    )
};

export default NavbarComp;
