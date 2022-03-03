import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {React, createContext , useState} from 'react';
import NavbarComp from "./components/Navbar";
import Home from "./pages/Home"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Page2 from "./pages/Page2";
import Login from "./pages/Login"
import Page404 from "./pages/Page404";
import User from "./logic/User"
import {Container, Card} from "react-bootstrap";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ABTests from "./pages/DashboardInnerPages/ABTests/ABTests";
import Datasets from "./pages/DashboardInnerPages/Datasets/Datasets";
import HomeDashboardPage from "./pages/DashboardInnerPages/homeDashboardPage";

let userSession = createContext();
function App() {
    let [user , setUser] = useState(new User());
    if(!user.isLoggedIn()){
        return(
            <userSession.Provider value={ {user , setUser } }>
                <Container style={{paddingTop: 20, paddingBottom: 30}}>
                    <Card className={"shadow"} style={{padding: 30}}>
                        <Login/>
                    </Card>
                </Container>
            </userSession.Provider>
        );
    }
  return (
      <userSession.Provider value={ {user , setUser } }>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<NavbarComp />}>
                      <Route index element={<Page2 />} />

                      <Route path="dashboard" element={<Dashboard />}>
                        <Route index element={<HomeDashboardPage />} />
                        <Route path="abTests" element={<ABTests />} />
                        <Route path="dataSets" element={<Datasets />} />
                      </Route>

                      <Route path="users" element={<Users />} />
                      <Route path="page404" element={<Page404 />} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </userSession.Provider>
  );
}

export default App;
export {userSession}
