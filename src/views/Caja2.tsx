import "../assets/Caja1.css";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import Header from "../components/Header";
import type { Persona } from "../types/Types";
import api from "../lib/api";

function Caja2() {
  const [registros, setRegistros] = useState<Persona[]>([]);

  useEffect(() => {
    const cargarPersona = async () => {
      try {
        const turnoLlamadoId = localStorage.getItem("turnoLlamadoId");

        if (turnoLlamadoId) {
          const { data } = await api.get<Persona>(`/turnos/${turnoLlamadoId}`);
          setRegistros(data ? [data] : []);
        } else {
          const { data } = await api.get<Persona[]>("/turnos");
          setRegistros(data.filter((p) => p.estado === "Llamado"));
        }
      } catch {
        setRegistros([]);
      }
    };

    cargarPersona();
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
