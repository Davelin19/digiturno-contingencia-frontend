import "../assets/ListadoDeRegistros.css";
import type { ListadoProps, Persona } from "../types/Types";
import { useNavigate } from "react-router-dom";
import {useState} from "react"

const API_URL = `${import.meta.env.VITE_API_URL}/turnos`;


function ListadoDeRegistros({
  registros,
  onEliminar,
  onEditar,
  caja,
  recargar
}: ListadoProps) {
const [turnoLlamado, setTurnoLlamado]=useState<Persona | null>(null)
  const navigate = useNavigate();

  // 📞 LLAMAR PERSONA (Caja 1)
  const llamar = async (persona: Persona) => {
    try {
      await fetch(`${API_URL}/${persona.id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "Llamado", // ⚠️ EXACTO
        }),
      });
      recargar?.(); // 🔥 ACTUALIZA LISTA
      fetch(`${API_URL}/${persona.id}`)
      .then((res)=>res.json())
      .then(res=>
        setTurnoLlamado(res)
      )

      navigate("/caja2");
    } catch (error) {
      console.error("Error llamando persona:", error);
    }
  };

  // ✔️ ATENDER (Caja 2)
const atender = async (persona: Persona) => {
  try {
    await fetch(`${API_URL}/${persona.id}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: "Atendido",
      }),
    });
    recargar?.(); // 🔥 ACTUALIZA LISTA

    console.log("Persona atendida:", persona.nombre);
    setTurnoLlamado(null)
    // 🔁 volver a caja 1
    navigate("/caja1");
  } catch (error) {
    console.error("Error al atender:", error);
  }
};


  // ❌ CANCELAR (Caja 2)
  const cancelar = async (persona: Persona) => {
    try {
      await fetch(`${API_URL}/${persona.id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "Cancelado",
        }),
      });
      recargar?.(); // 🔥 ACTUALIZA LISTA
      
      setTurnoLlamado(null)
      navigate("/caja1");
    } catch (error) {
      console.error("Error cancelando persona:", error);
    }
  };


  return (
    <div className="listado">
      <div className="listado-header">
        <h2>
          {caja === 2 ? "Personas en Atención" : "Personas en Sala"}
        </h2>
      </div>

      {registros.length === 0 ? (
        <p className="vacio">No hay personas</p>
        ) : (
          <ul>
          {turnoLlamado?<li key={turnoLlamado.id} className="item">
              <div>
                <div className="nombre">{turnoLlamado.nombre}</div>
                <div className="detalle">
                  CC: {turnoLlamado.cedula} · {turnoLlamado.destino} · {turnoLlamado.estado}
                </div>
              </div>

             
                <div className="col">
                  <button
                    className="btn-llamar"
                    onClick={() => atender(turnoLlamado)}
                  >
                    ✔️ Atendido
                  </button>
                  <button
                    className="btn-llamar"
                    onClick={() => cancelar(turnoLlamado)}
                  >
                    ❌ Cancelado
                  </button>
                </div>
              
            </li>:registros.map((persona, index) => (
            <li key={persona.id} className="item">
              <div>
                <div className="nombre">{persona.nombre}</div>
                <div className="detalle">
                  CC: {persona.cedula} · {persona.destino} · {persona.estado}
                </div>
              </div>
              
              {/* RECEPCIÓN */}
              {caja === 0 && (
                <div className="col">
                  <button
                    className="btn-editar"
                    onClick={() => onEditar?.(persona.id)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => onEliminar?.(persona.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}

              {/* CAJA VISTA 1 */}
              {caja === 1 && index === 0 && (
                <div className="col">
                  <button className="btn-llamar" onClick={() => llamar(persona)}>
                    📞 Llamar
                  </button>
                </div>
              )}

              {/* CAJA VISTA 2 */}
              {caja === 2 && (
                <div className="col">
                  <button
                    className="btn-llamar"
                    onClick={() => atender(persona)}
                  >
                    ✔️ Atendido
                  </button>
                  <button
                    className="btn-llamar"
                    onClick={() => cancelar(persona)}
                  >
                    ❌ Cancelado
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListadoDeRegistros;
