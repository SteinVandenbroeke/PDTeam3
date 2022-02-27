import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import NavbarComp from "./components/Navbar";
import Home from "./pages/Home"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Page2 from "./pages/Page2";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<NavbarComp />}>
                  <Route index element={<Home />} />
                  <Route path="page2" element={<Page2 />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
