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
import Users from "./pages/Users/Users";
import ABTests from "./pages/DashboardInnerPages/ABTests/ABTests";
import DatasetsIndex from "./pages/DashboardInnerPages/Datasets/DatasetsIndex";
import HomeDashboardPage from "./pages/DashboardInnerPages/homeDashboardPage";
import AddDataset from "./pages/DashboardInnerPages/Datasets/AddDataset"
import DataSetsList from "./pages/DashboardInnerPages/Datasets/DatasetsList"
import AddUsers from "./pages/Users/AddUser";
import UserList from "./pages/Users/UserList";

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
                          <Route path="dataSets" element={<DatasetsIndex />}>
                              <Route index element={<DataSetsList />}/>
                              <Route path="add" element={<AddDataset />}/>
                          </Route>
                          <Route path="vbPagina" element={<Home />} />
                      </Route>

                      <Route path="users" element={<Users />} >
                          <Route index element={<UserList />}/>
                          <Route path="add" element={<AddUsers />}/>
                      </Route>
                      <Route path="page404" element={<Page404 />} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </userSession.Provider>
  );
}

export default App;
export {userSession}
