import { useContext, useEffect } from "react";
import SalaContext from "../contexts/SalaContext";
import type { HeaderProps } from "../types/Types";
import { useState } from "react";
import type { Sala } from "../types/Types";
import api from "../lib/api";

function Header({ titulo }: HeaderProps) {
  const salaContext = useContext(SalaContext);
  const [sala, setSala] = useState<Sala | undefined>();

  useEffect(() => {
    if (!salaContext) return;
    const { salaId } = salaContext;
    if (!salaId) return;

    api
      .get<Sala>(`/salas/${salaId}`)
      .then(({ data }) => setSala(data))
      .catch(() => {});

    salaContext.setPerfilCaja(localStorage.getItem("perfilCaja"));
  }, [salaContext]);

  if (!salaContext) return null;

  const { salaId, perfilCaja } = salaContext;

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo.png" alt="Cámara de Comercio" />
      </div>

      <h1 className="titulo">{titulo}</h1>

      <div className="header-info">
        {salaId > 0 && (
          <div className="sala-actual">
            Sala {sala?.nombre || "Cargando..."}
          </div>
        )}

        {perfilCaja && <div className="perfil-caja">Perfil: {perfilCaja}</div>}
      </div>
    </header>
  );
}

export default Header;
