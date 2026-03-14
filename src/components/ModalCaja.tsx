import { useEffect, useState } from "react";
import "../assets/ModalCaja.css";
import type { Caja, Sala } from "../types/Types";
import type { ModalCajaProps } from "../types/Types";
import { useContext } from "react";
import SalaContext from "../contexts/SalaContext";
import api from "../lib/api";

function ModalCaja({ modo, onConfirmar }: ModalCajaProps) {
  const [sala, setSala] = useState(0);
  const [caja, setCaja] = useState(0);
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const salaContext = useContext(SalaContext);

  useEffect(() => {
    api
      .get<Sala[]>("/salas")
      .then(({ data }) => setSalas(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sala && modo === "caja") {
      api
        .get<Caja[]>(`/cajas/sala/${sala}`)
        .then(({ data }) => {
          setCajas(data);
          setCaja(0);
        })
        .catch(() => {});
    }
  }, [sala, modo]);

  const confirmar = async () => {
    if (!sala) return;

    localStorage.setItem("salaSeleccionada", sala.toString());

    if (modo === "caja") {
      if (!caja) return;

      try {
        const { data: raw } = await api.get(`/cajas/${caja}`);
        const cajaData = Array.isArray(raw) ? raw[0] : raw;

        if (!cajaData?.perfil_atencion) {
          console.error("Perfil de caja inválido", cajaData);
          return;
        }

        localStorage.setItem("cajaSeleccionada", caja.toString());
        localStorage.setItem("perfilCaja", cajaData.perfil_atencion);

        salaContext?.setPerfilCaja(cajaData.perfil_atencion);
        onConfirmar(sala, caja, cajaData.perfil_atencion);
      } catch {
        // el interceptor muestra el toast
      }
    } else {
      onConfirmar(sala);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Configuración</h2>

        <select value={sala} onChange={(e) => setSala(Number(e.target.value))}>
          <option value={0}>Selecciona sala</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              Sala {s.nombre}
            </option>
          ))}
        </select>

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
