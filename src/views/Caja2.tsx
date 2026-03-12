import "../assets/Caja1.css";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import Header from "../components/Header";
import type { Persona } from "../types/Types";

const API_URL = "https://cv8qdx88-3000.use2.devtunnels.ms/api/turnos";

function Caja2() {
  const [registros, setRegistros] = useState<Persona[]>([]);

useEffect(() => {
  const cargarPersona = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Persona[] = await res.json();

      setRegistros(
        data.filter(p => p.estado === "Llamado")
      );
    } catch (error) {
      console.error(error);
    }
  };

  cargarPersona();
  // const interval = setInterval(cargarPersona, 3000);
  // return () => clearInterval(interval);
}, []);


  return (
    <div className="pantalla">
      <Header titulo="CAJA 2" />
      <div className="caja1">
        <ListadoDeRegistros registros={registros} caja={2} />
      </div>
    </div>
  );
}

export default Caja2;
