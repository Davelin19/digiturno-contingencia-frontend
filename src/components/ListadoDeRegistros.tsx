import "../assets/ListadoDeRegistros.css";
import type { ListadoProps, Persona } from "../types/Types";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function ListadoDeRegistros({
  registros,
  onEliminar,
  onEditar,
  caja,
  recargar,
}: ListadoProps) {
  const navigate = useNavigate();

  const llamar = async (persona: Persona) => {
    try {
      await api.patch(`/turnos/${persona.id}/estado`, { estado: "Llamado" });
      localStorage.setItem("turnoLlamadoId", persona.id.toString());
      recargar?.();
      navigate("/caja2");
    } catch {
      // el interceptor muestra el toast
    }
  };

  const atender = async (persona: Persona) => {
    try {
      await api.patch(`/turnos/${persona.id}/estado`, { estado: "Atendido" });
      recargar?.();
      localStorage.removeItem("turnoLlamadoId");
      navigate("/caja1");
    } catch {
      // el interceptor muestra el toast
    }
  };

  const cancelar = async (persona: Persona) => {
    try {
      await api.patch(`/turnos/${persona.id}/estado`, { estado: "Cancelado" });
      recargar?.();
      localStorage.removeItem("turnoLlamadoId");
      navigate("/caja1");
    } catch {
      // el interceptor muestra el toast
    }
  };

  return (
    <div className="listado">
      <div className="listado-header">
        <h2>{caja === 2 ? "Personas en Atención" : "Personas en Sala"}</h2>
      </div>

      {registros.length === 0 ? (
        <p className="vacio">No hay personas</p>
      ) : (
        <ul>
          {registros.map((persona, index) => (
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
                  <button
                    className="btn-llamar"
                    onClick={() => llamar(persona)}
                  >
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
