import { createContext } from "react";

interface SalaContextType {
  salaId: number;
  setSalaId: (id: number) => void;
  perfilCaja: string | null;
  setPerfilCaja: (perfil: string | null) => void;
}

const SalaContext = createContext<SalaContextType | null>(null);

export default SalaContext;
