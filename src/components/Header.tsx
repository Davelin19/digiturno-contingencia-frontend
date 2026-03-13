import { useContext, useEffect } from "react";
import SalaContext from "../contexts/SalaContext";
import type { HeaderProps } from "../types/Types";
import { useState } from "react";
import type { Sala } from "../types/Types";

function Header({ titulo }: HeaderProps) {
  const salaContext = useContext(SalaContext);
  const [sala, setSala] = useState<Sala | undefined>();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!salaContext) return;
    const { salaId } = salaContext;
    if (!salaId) return;

    fetch(`${API_URL}/salas/${salaId}`)
      .then((res) => res.json())
      .then((data) => setSala(data))
      .catch((err) => console.error("Error cargando sala:", err));
    salaContext.setPerfilCaja(localStorage.getItem("perfilCaja"));
  }, [salaContext]);

  if (!salaContext) return null;

  const { salaId, perfilCaja } = salaContext;

  return (
    <header className="header">
      {/* LOGO */}
      <div className="logo-container">
        <img src="/logo.png" alt="Cámara de Comercio" />
      </div>

      {/* TÍTULO */}
      <h1 className="titulo">{titulo}</h1>

      {/* INFO DERECHA */}
      <div className="header-info">
        {salaId > 0 && (
          <div className="sala-actual">
            Sala {sala?.nombre || "Cargando..."}
          </div>
        )}

        {/* PERFIL DE LA CAJA (solo en caja) */}
        {perfilCaja && <div className="perfil-caja">Perfil: {perfilCaja}</div>}
      </div>
    </header>
  );
}

export default Header;
