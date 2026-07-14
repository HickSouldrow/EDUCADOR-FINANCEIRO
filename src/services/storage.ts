import type { Simulation } from "../types/simulation";

const SIMULATIONS_KEY = "efi:simulations";

export function getSimulations(): Simulation[] {
  const raw = localStorage.getItem(SIMULATIONS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Simulation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSimulationById(id: string): Simulation | undefined {
  return getSimulations().find((simulation) => simulation.id === id);
}

export function saveSimulation(simulation: Simulation): void {
  const simulations = getSimulations();
  const next = [simulation, ...simulations.filter((item) => item.id !== simulation.id)];
  localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(next));
}

export function updateSimulation(id: string, update: Partial<Simulation>): Simulation | undefined {
  const simulations = getSimulations();
  const current = simulations.find((item) => item.id === id);
  if (!current) return undefined;

  const updated = { ...current, ...update };
  const next = simulations.map((item) => (item.id === id ? updated : item));
  localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(next));
  return updated;
}

export function deleteSimulation(id: string): void {
  const next = getSimulations().filter((simulation) => simulation.id !== id);
  localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(next));
}