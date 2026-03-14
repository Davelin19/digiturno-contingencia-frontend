import "../assets/Caja1.css";
import { useEffect, useState } from "react";
import ListadoDeRegistros from "../components/ListadoDeRegistros";
import Header from "../components/Header";
import ModalCaja from "../components/ModalCaja";
import SalaContext from "../contexts/SalaContext";
import type { Persona } from "../types/Types";
import api from "../lib/api";

function Caja1() {
  const [registros, setRegistros] = useState<Persona[]>([]);
  const [cargando, setCargando] = useState(true);

  const [salaSeleccionada, setSalaSeleccionada] = useState(0);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(0);
  const [perfilCaja, setPerfilCaja] = useState<string | null>(null);
  const [configurada, setConfigurada] = useState(false);
  const [nombreCaja, setNombreCaja] = useState("");

  useEffect(() => {
    const salaLS = localStorage.getItem("salaSeleccionada");
    const cajaLS = localStorage.getItem("cajaSeleccionada");

    if (salaLS && cajaLS) {
      setSalaSeleccionada(Number(salaLS));
      setCajaSeleccionada(Number(cajaLS));
      setConfigurada(true);
    }
  }, []);

  useEffect(() => {
    if (!cajaSeleccionada) return;

    api
      .get(`/cajas/${cajaSeleccionada}`)
      .then(({ data }) => {
        setPerfilCaja(data.perfil);
        setNombreCaja(data.nombre);
      })
      .catch(() => {});
  }, [cajaSeleccionada]);

  const cargarDatos = async () => {
    try {
      const perfilConsulta = localStorage.getItem("perfilCaja");
      const id_sala = localStorage.getItem("salaSeleccionada");
      const { data } = await api.get<Persona[]>(
        `/turnos/perfil_sala/${perfilConsulta}/sala/${id_sala}`
      );
      setRegistros(data);
    } catch {
      // el interceptor muestra el toast
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (configurada) {
      cargarDatos();
      const i = setInterval(cargarDatos, 3000);
      return () => clearInterval(i);
    }
  }, [configurada, salaSeleccionada]);

  return (
    <SalaContext.Provider
      value={{
        salaId: salaSeleccionada,
        setSalaId: setSalaSeleccionada,
        perfilCaja,
        setPerfilCaja,
      }}
    >
      <div className="pantalla">
        <Header titulo={`CAJA ${nombreCaja}`} />

        {!configurada && (
          <ModalCaja
            modo="caja"
            onConfirmar={(sala, caja) => {
              setSalaSeleccionada(sala);
              setCajaSeleccionada(caja || 0);

              localStorage.setItem("salaSeleccionada", sala.toString());
              localStorage.setItem("cajaSeleccionada", caja?.toString() || "0");

              setConfigurada(true);
              setCargando(true);
            }}
          />
        )}

        {configurada && (
          <div className="caja1">
            {cargando ? (
              <p>Cargando...</p>
            ) : (
              <ListadoDeRegistros registros={registros} caja={1} />
            )}
          </div>
        )}
      </div>
    </SalaContext.Provider>
  );
}

export default Caja1;
