// Short Description: Main javascript head file
// @author : PPDB Team 3

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {React, createContext , useState} from 'react';
import NavbarComp from "./components/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login"
import Page404 from "./pages/Page404";
import {User} from "./logic/User"
import {Container, Card} from "react-bootstrap";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users/Users";

import ABTestsIndex from "./pages/DashboardInnerPages/ABTests/ABTestsIndex";
import ABTestsList from "./pages/DashboardInnerPages/ABTests/ABTestsList";
import ABTestOverview from "./pages/DashboardInnerPages/ABTests/ABTestOverview";
import AddABTest from "./pages/DashboardInnerPages/ABTests/AddABTest";

import DatasetsIndex from "./pages/DashboardInnerPages/Datasets/DatasetsIndex";
import DataSetsList from "./pages/DashboardInnerPages/Datasets/DatasetsList";
import DataSetOverview from "./pages/DashboardInnerPages/Datasets/DatasetOverview";
import ItemOverview from "./pages/DashboardInnerPages/Datasets/ItemPage";
import PersonOverview from "./pages/DashboardInnerPages/Datasets/PersonPage";
import AddDataset from "./pages/DashboardInnerPages/Datasets/AddDataset";

import HomeDashboardPage from "./pages/DashboardInnerPages/homeDashboardPage";
import AddUsers from "./pages/Users/AddUser";
import UserList from "./pages/Users/UserList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatasetEdit from "./pages/DashboardInnerPages/Datasets/DatasetEdit";
import ErrorBoundary from "./components/ErrorBoundary"
import AbTestUploadsPage from "./pages/DashboardInnerPages/abTestUploadsPage";

let userSession = createContext();
function App() {
    document.title = "AvsA"
    let [user , setUser] = useState(new User());
    if(!user.isLoggedIn()){
        return(
            <userSession.Provider value={ {user , setUser } }>
                <ToastContainer />
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
          <ToastContainer />
          <ErrorBoundary>
              <BrowserRouter>
                  <Routes>
                      <Route path="full">
                          <Route path="dataSets">
                              <Route path="overview/:setid" element={<DataSetOverview />}/>
                              <Route path="overview/:setid/item/:itemid" element={<ItemOverview />}/>
                              <Route path="overview/:setid/person/:personid" element={<PersonOverview />}/>
                              <Route path="overview/:setid/edit/" element={<DatasetEdit />}/>
                          </Route>
                      </Route>
                      <Route path="/" element={<NavbarComp />}>
                          <Route index element={<div style={{paddingTop: 50}}><HomeDashboardPage /></div>} />

                          <Route path="dashboard" element={<Dashboard />}>
                              <Route index element={<HomeDashboardPage />} />

                              <Route path="abTests" element={<ABTestsIndex />}>
                                  <Route index element={<ABTestsList />}/>
                                  <Route path="add" element={<AddABTest />}/>
                                  <Route path="overview/:abTestId" element={<ABTestOverview />}/>
                              </Route>

                              <Route path="dataSets" element={<DatasetsIndex />}>
                                  <Route index element={<DataSetsList />}/>
                                  <Route path="add" element={<AddDataset />}/>
                                  <Route path="overview/:setid" element={<DataSetOverview />}/>
                                  <Route path="overview/:setid/item/:itemid" element={<ItemOverview />}/>
                                  <Route path="overview/:setid/person/:personid" element={<PersonOverview />}/>
                                  <Route path="overview/:setid/edit/" element={<DatasetEdit />}/>
                              </Route>
                              <Route path="abTestUploads" element={<AbTestUploadsPage />} />
                          </Route>

                          <Route path="users" element={<Users />} >
                              <Route index element={<UserList />}/>
                              <Route path="add" element={<AddUsers />}/>
                          </Route>
                          <Route path="*" element={<Page404 />} />
                      </Route>
                  </Routes>
              </BrowserRouter>
          </ErrorBoundary>
      </userSession.Provider>
  );
}

export default App;
export {userSession}
