import Header from "../components/Header";
import Formulario from "../components/Formulario";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import ModalCaja from "../components/ModalCaja"; // 👈 lo reutilizamos como modal de sala
import type { Persona } from "../types/Types";
import "../assets/Recepcion.css";
import SalaContext from "../contexts/SalaContext";

const API_URL = `${import.meta.env.VITE_API_URL}/turnos`;

function Recepcion() {
  const [registros, setRegistros] = useState<Persona[]>([]);
  const [personaEditando, setPersonaEditando] = useState<Persona | null>(null);
  const [cargando] = useState(false);

  // 🔹 SALA
  const [salaSeleccionada, setSalaSeleccionada] = useState<number>(0);
  const [configurada, setConfigurada] = useState(false);

  // 🔹 CARGAR SALA DESDE LOCALSTORAGE
  useEffect(() => {
    const salaLS = localStorage.getItem("salaRecepcion");
    if (salaLS) {
      setSalaSeleccionada(Number(salaLS));
      setConfigurada(true);
    }
  }, []);

  // 🔹 RECARGA AUTOMÁTICA CADA 5 SEGUNDOS
useEffect(() => {
  if (!configurada) return;

  const interval = setInterval(() => {
    cargarPersonas();
  }, 5000);

  return () => clearInterval(interval); // limpiar al desmontar
}, [salaSeleccionada, configurada]);

  // 🔹 CARGAR PERSONAS
const cargarPersonas = async () => {
  if (!configurada) return;

  try {
    const res = await fetch(API_URL);
    const data: Persona[] = await res.json();

    const filtrados = data.filter(
      (p) =>
        p.id_sala === salaSeleccionada &&
        p.estado === "En espera"
    );

    // 🔥 SOLO ACTUALIZA SI CAMBIÓ
    setRegistros((prev) => {
      const iguales =
        JSON.stringify(prev) === JSON.stringify(filtrados);
      return iguales ? prev : filtrados;
    });

  } catch (error) {
    console.error("Error cargando personas:", error);
  }
};

  useEffect(() => {
    cargarPersonas();
  }, [salaSeleccionada, configurada]);

  // 🔹 CREAR / ACTUALIZAR
  const guardarPersona = async (persona: Persona) => {
    try {
      const personaConSala = {
        ...persona,
        id_sala: salaSeleccionada,
      };

      if (personaEditando) {
        await fetch(`${API_URL}/cedula/${persona.cedula}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(personaConSala),
        });
        setPersonaEditando(null);
      } else {
        console.log("POST", API_URL, personaConSala);
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(personaConSala),
        });
      }

      cargarPersonas();
    } catch (error) {
      console.error("Error guardando persona:", error);
    }
  };

  // 🔹 EDITAR
  const editarPersona = (id: number) => {
    const persona = registros.find((p) => p.id === id);
    if (persona) setPersonaEditando(persona);
  };

  // 🔹 ELIMINAR
  const eliminarRegistro = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarPersonas();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <SalaContext.Provider
      value={{ 
        salaId: salaSeleccionada, 
        setSalaId: setSalaSeleccionada,
        perfilCaja: null,
        setPerfilCaja: () => {}
      }}
    >
      <div className="pantalla">
        {/* HEADER SOLO MUESTRA LA SALA */}
        <Header titulo="RECEPCIÓN" />

        {/* 🔥 MODAL PARA ELEGIR SALA */}
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

        {/* CONTENIDO */}
        {configurada && (
          <div className="contenido-doble">
            <Formulario
              onEnviar={(data) => guardarPersona({
                ...data, id_sala: salaSeleccionada,
                id: undefined
              })}
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
