const API_URL = "http://localhost:3000";

export async function obtenerPersonas() {
  const res = await fetch(`${API_URL}/personas`);
  return res.json();
}

export async function crearPersona(persona: any) {
  const res = await fetch(`${API_URL}/personas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona),
  });

  if (!res.ok) throw new Error("Error al guardar");
}
