import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./views/Home"));
const Navbar = lazy(() => import("./components/Navbar"));
const Clustor = lazy(() => import("./views/Clustor"));
const Footer = lazy(() => import("./components/Footer"));
const Create = lazy(() => import("./views/Create"));

const App = () => {
  return (
    <div className="App">
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/clustors/:address" element={<Clustor />} />
          <Route path="/clustors/create/" element={<Create />} />
        </Routes>
      </Router>
        <Footer />
    </div>
  );
};

export default App;
