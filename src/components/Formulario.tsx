import { useEffect, useState } from "react";
import "../assets/Formulario.css";
import type { FormularioProps } from "../types/Types";

function Formulario({ onEnviar, personaEditando }: FormularioProps) {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [destino, setDestino] = useState("");
  const API_URL = import.meta.env.VITE_API_URL
  const [perfiles, setPerfiles]=useState([])

  useEffect(()=>{
    const id_sala = localStorage.getItem("salaSeleccionada")
    fetch(`${API_URL}/salas/${id_sala}/perfiles_atencion`)
    .then(res=>res.json())
    .then(res=>setPerfiles(res))
  },[cedula])

  useEffect(() => {
    if (personaEditando) {
      setCedula(String(personaEditando.cedula));
      setNombre(personaEditando.nombre);
      setDestino(personaEditando.destino);
    } else {
      setCedula("");
      setNombre("");
      setDestino("");
    }
  }, [personaEditando]);

 
  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cedula || !nombre || !destino ) {
      alert("Completa todos los campos");
      return;
    }

    onEnviar({
      cedula: Number(cedula),
      nombre,
      destino,
      estado: "en espera",
      id_sala: personaEditando?.id_sala || 0,
    });

    setCedula("");
    setNombre("");
    setDestino("");
  };

  return (
    <div className="formulario-wrapper">
      <form className="formulario" onSubmit={enviarFormulario}>
        <h2>{personaEditando ? "Editar Visitante" : "Registro de Visitantes"}</h2>

        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <select value={destino} onChange={(e) => setDestino(e.target.value)}>
          <option value="">¿Para dónde va?</option>
          {perfiles.map((p,i)=>(<option key={i} value={p}>{p}</option>))}
        </select>

        <button type="submit">
          {personaEditando ? "Actualizar" : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default Formulario;
