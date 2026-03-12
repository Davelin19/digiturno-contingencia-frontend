export interface Persona {
  id: any;
  cedula: number;
  nombre: string;
  destino: string;
  estado: string;
  id_sala: number;
}


export interface ListadoProps {
  registros: Persona[];
  onEliminar?: (cedula: number) => void;
  onEditar?: (cedula: number) => void;
  caja:number;
  persona ? :Persona | null;
  recargar?: () => void;
}

export interface FormularioProps {
  onEnviar: (data: {
    cedula: number;
    nombre: string;
    destino: string;
    estado: string;
    id_sala: number;
  }) => void;
  personaEditando: Persona | null;
}

export interface HeaderProps {
  titulo: string;
  perfilCaja?: string | null;
  mostrarSelectorSala?: boolean;
  salaSeleccionada?: number;
  onCambiarSala?: (idSala: number) => void;
}

export interface Caja {
  id: number;
  nombre: string;
  perfil_atencion: string;
}

export interface Sala {
  id: number;
  nombre: string;
}

export interface ModalCajaProps {
  modo: "caja" | "recepcion";
  onConfirmar: (sala: number, caja?: number, perfil?: string) => void;
}

