const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchProjects(){
  const res = await fetch(`${BASE}/api/projects`); if(!res.ok) throw new Error('Erro ao buscar'); return res.json();
}
export async function createProject(data){ const res = await fetch(`${BASE}/api/projects`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!res.ok) throw new Error('Erro ao criar'); return res.json(); }
export async function updateProject(id,data){ const res = await fetch(`${BASE}/api/projects/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!res.ok) throw new Error('Erro ao atualizar'); return res.json(); }
export async function deleteProject(id){ const res = await fetch(`${BASE}/api/projects/${id}`,{method:'DELETE'}); if(!res.ok) throw new Error('Erro ao deletar'); return res.json(); }
