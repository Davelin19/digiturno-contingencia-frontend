import { useEffect, useState } from "react";
import "../assets/ModalCaja.css";
import type { Caja, Sala } from "../types/Types";
import type { ModalCajaProps } from "../types/Types";
import { useContext } from "react";
import SalaContext from "../contexts/SalaContext";

const API_URL = import.meta.env.VITE_API_URL;

function ModalCaja({ modo, onConfirmar }: ModalCajaProps) {
  const [sala, setSala] = useState(0);
  const [caja, setCaja] = useState(0);
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const salaContext = useContext(SalaContext);

  // 🔹 CARGAR SALAS
  useEffect(() => {
    fetch(`${API_URL}/salas`)
      .then((res) => res.json())
      .then(setSalas)
      .catch((err) => console.error("Error cargando salas:", err));
  }, []);

  // 🔹 CARGAR CAJAS SEGÚN SALA
  useEffect(() => {
    if (sala && modo === "caja") {
      fetch(`${API_URL}/cajas/sala/${sala}`)
        .then((res) => res.json())
        .then((data) => {
          setCajas(data);
          setCaja(0);
        })
        .catch((err) => console.error("Error cargando cajas:", err));
    }
  }, [sala, modo]);

  // Eliminar efecto que resetea cajas y caja para evitar renders en cascada

  const confirmar = async () => {
    if (!sala) return;

    localStorage.setItem("salaSeleccionada", sala.toString());

    if (modo === "caja") {
      if (!caja) return;

      try {
        const res = await fetch(`${API_URL}/cajas/${caja}`);
        const raw = await res.json();

        // 🔥 si viene como array, tomar el primero
        const cajaData = Array.isArray(raw) ? raw[0] : raw;

        if (!cajaData?.perfil_atencion) {
          console.error("Perfil de caja inválido", cajaData);
          return;
        }

        localStorage.setItem("cajaSeleccionada", caja.toString());
        localStorage.setItem("perfilCaja", cajaData.perfil_atencion);

        // 🔥 CONTEXTO
        salaContext?.setPerfilCaja(cajaData.perfil_atencion);

        // 🔥 PADRE
        onConfirmar(sala, caja, cajaData.perfil_atencion);
      } catch (err) {
        console.error("Error obteniendo perfil de caja:", err);
      }
    } else {
      onConfirmar(sala);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Configuración</h2>

        {/* 🔹 SALA */}
        <select value={sala} onChange={(e) => setSala(Number(e.target.value))}>
          <option value={0}>Selecciona sala</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              Sala {s.nombre}
            </option>
          ))}
        </select>

        {/* 🔹 CAJA */}
        {modo === "caja" && sala !== 0 && (
          <select
            value={caja}
            onChange={(e) => setCaja(Number(e.target.value))}
            disabled={!sala}
          >
            <option value={0}>Selecciona caja</option>
            {cajas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.perfil_atencion}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={confirmar}
          disabled={modo === "caja" ? !sala || !caja : !sala}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default ModalCaja;
