import api from "../lib/api";
import type { Persona } from "../types/Types";

export async function obtenerPersonas(): Promise<Persona[]> {
  const { data } = await api.get<Persona[]>("/personas");
  return data;
}

export async function crearPersona(persona: Partial<Persona>): Promise<void> {
  await api.post("/personas", persona);
}
