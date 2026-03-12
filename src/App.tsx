import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recepcion from "./views/Recepcion";
// import Cajas from "./views/Cajas";
import "./App.css";
import Caja1 from "./views/Caja1";
import Caja2 from "./views/Caja2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Recepcion />} />
        <Route path="/caja1" element={<Caja1 />} />
        <Route path="/caja2" element={<Caja2 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
