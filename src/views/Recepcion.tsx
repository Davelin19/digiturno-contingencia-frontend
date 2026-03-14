import Header from "../components/Header";
import Formulario from "../components/Formulario";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import ModalCaja from "../components/ModalCaja";
import type { Persona } from "../types/Types";
import "../assets/Recepcion.css";
import SalaContext from "../contexts/SalaContext";
import api from "../lib/api";

function Recepcion() {
  const [registros, setRegistros] = useState<Persona[]>([]);
  const [personaEditando, setPersonaEditando] = useState<Persona | null>(null);
  const [cargando] = useState(false);

  const [salaSeleccionada, setSalaSeleccionada] = useState<number>(0);
  const [configurada, setConfigurada] = useState(false);

  async function cargarPersonas() {
    if (!configurada) return;

    try {
      const { data } = await api.get<Persona[]>("/turnos");
      const filtrados = data.filter(
        (p) => p.id_sala === salaSeleccionada && p.estado === "En espera"
      );

      setRegistros((prev) => {
        const iguales = JSON.stringify(prev) === JSON.stringify(filtrados);
        return iguales ? prev : filtrados;
      });
    } catch {
      // el interceptor muestra el toast
    }
  }

  useEffect(() => {
    const salaLS = localStorage.getItem("salaRecepcion");
    if (salaLS) {
      Promise.resolve().then(() => {
        setSalaSeleccionada(Number(salaLS));
        setConfigurada(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!configurada) return;

    const interval = setInterval(() => {
      cargarPersonas();
    }, 5000);

    return () => clearInterval(interval);
  }, [salaSeleccionada, configurada]);

  const guardarPersona = async (persona: Persona) => {
    try {
      const personaConSala = { ...persona, id_sala: salaSeleccionada };

      if (personaEditando) {
        await api.put(`/turnos/cedula/${persona.cedula}`, personaConSala);
        setPersonaEditando(null);
      } else {
        await api.post("/turnos", personaConSala);
      }

      cargarPersonas();
    } catch {
      // el interceptor muestra el toast
    }
  };

  const editarPersona = (id: number) => {
    const persona = registros.find((p) => p.id === id);
    if (persona) setPersonaEditando(persona);
  };

  const eliminarRegistro = async (id: number) => {
    try {
      await api.delete(`/turnos/${id}`);
      cargarPersonas();
    } catch {
      // el interceptor muestra el toast
    }
  };

  return (
    <SalaContext.Provider
      value={{
        salaId: salaSeleccionada,
        setSalaId: setSalaSeleccionada,
        perfilCaja: null,
        setPerfilCaja: () => {},
      }}
    >
      <div className="pantalla">
        <Header titulo="RECEPCIÓN" />

        {!configurada && (
          <ModalCaja
            modo="recepcion"
            onConfirmar={(sala) => {
              if (!sala) return;
              setSalaSeleccionada(sala);
              localStorage.setItem("salaRecepcion", sala.toString());
              setConfigurada(true);
            }}
          />
        )}

        {configurada && (
          <div className="contenido-doble">
            <Formulario
              onEnviar={(data) =>
                guardarPersona({
                  ...data,
                  id_sala: salaSeleccionada,
                  id: undefined,
                })
              }
              personaEditando={personaEditando}
            />

            {cargando ? (
              <p>Cargando registros...</p>
            ) : (
              <ListadoDeRegistros
                registros={registros}
                caja={0}
                onEditar={editarPersona}
                onEliminar={eliminarRegistro}
                recargar={cargarPersonas}
              />
            )}
          </div>
        )}
      </div>
    </SalaContext.Provider>
  );
}

export default Recepcion;
