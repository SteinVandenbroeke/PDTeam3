import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {React, createContext , useState} from 'react';
import NavbarComp from "./components/Navbar";
import Home from "./pages/Home"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Page2 from "./pages/Page2";
import Login from "./pages/Login"
import User from "./logic/User"
import {Container, Card} from "react-bootstrap";

let userSession = createContext();
function App() {
    let [user , setUser] = useState(new User());
    if(!false){
        return(
            <Container style={{paddingTop: 20, paddingBottom: 30}}>
                <Card className={"shadow"} style={{padding: 30}}>
                    <Login/>
                </Card>
            </Container>
        );
    }
  return (
      <userSession.Provider value={ {user , setUser } }>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<NavbarComp />}>
                      <Route index element={<Home />} />
                      <Route path="login" element={<Login />} />
                      <Route path="page2" element={<Page2 />} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </userSession.Provider>
  );
}

export default App;
export {userSession}
