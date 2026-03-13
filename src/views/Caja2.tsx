import "../assets/Caja1.css";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import Header from "../components/Header";
import type { Persona } from "../types/Types";

const API_URL = `${import.meta.env.VITE_API_URL}/turnos`;

function Caja2() {
  const [registros, setRegistros] = useState<Persona[]>([]);

  useEffect(() => {
    const cargarPersona = async () => {
      try {
        const turnoLlamadoId = localStorage.getItem("turnoLlamadoId");

        if (turnoLlamadoId) {
          const res = await fetch(`${API_URL}/${turnoLlamadoId}`);
          if (!res.ok) {
            throw new Error("No se encontró el turno llamado");
          }
          const persona: Persona = await res.json();
          setRegistros(persona ? [persona] : []);
        } else {
          const res = await fetch(API_URL);
          const data: Persona[] = await res.json();
          setRegistros(data.filter((p) => p.estado === "Llamado"));
        }
      } catch (error) {
        console.error(error);
        setRegistros([]);
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
