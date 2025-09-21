import React, { useEffect, useState } from 'react';
import * as api from './api';

function App(){
  const [projects,setProjects] = useState([]);
  const [view,setView] = useState('dashboard');
  const [editing,setEditing] = useState(null);
  const [query,setQuery] = useState('');
  const [user,setUser] = useState({logged:false,username:''});

  async function load(){ try{ const p = await api.fetchProjects(); setProjects(p); }catch(e){ console.error(e); } }
  useEffect(()=>{ load(); },[]);

  async function addProject(data){ try{ const created = await api.createProject(data); setProjects(prev=>[created,...prev]); setView('dashboard'); }catch(e){ alert('Erro ao criar'); }}
  async function saveProject(id,data){ try{ const updated = await api.updateProject(id,data); setProjects(prev=>prev.map(p=>p.id===id?updated:p)); setEditing(null); setView('dashboard'); }catch(e){ alert('Erro ao atualizar'); }}
  async function removeProject(id){ if(!confirm('Remover?')) return; try{ await api.deleteProject(id); setProjects(prev=>prev.filter(p=>p.id!==id)); }catch(e){ alert('Erro ao remover'); }}

  const filtered = projects.filter(p=>p.title.toLowerCase().includes(query.toLowerCase()) || (p.tags||[]).join(' ').toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{padding:20,maxWidth:1100,margin:'0 auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <h1>PortfolioApp</h1>
        <div>
          {user.logged ? (<><span>Olá, {user.username}</span><button onClick={()=>setUser({logged:false,username:''})}>Sair</button></>) : (<button onClick={()=>setView('login')}>Entrar</button>)}
        </div>
      </header>

      <main style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16}}>
        <section>
          <div style={{background:'#0b1220',padding:12,borderRadius:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3>Meus projetos</h3>
              <div>
                <input placeholder="Pesquisar" value={query} onChange={e=>setQuery(e.target.value)} />
                <button onClick={()=>setQuery('')}>Limpar</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              {filtered.map(p=> (
                <div key={p.id} style={{background:'#071427',padding:10,borderRadius:8,display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <div>
                    <strong>{p.title}</strong>
                    <div style={{color:'#94a3b8'}}>{p.description}</div>
                    <div style={{color:'#7c9ccf'}}>{(p.tags||[]).join(' • ')}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <button onClick={()=>{ setEditing(p); setView('editor');}}>Editar</button>
                    <button onClick={()=>removeProject(p.id)}>Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:12,background:'#071427',padding:12,borderRadius:10}}>
            <h4>{editing ? 'Editar projeto' : 'Adicionar novo projeto'}</h4>
            <ProjectForm onSubmit={editing ? (data)=>saveProject(editing.id,data) : addProject} initial={editing} onCancel={()=>{setEditing(null); setView('dashboard')}} />
          </div>
        </section>

        <aside>
          <div style={{background:'#071427',padding:12,borderRadius:10}}>
            <h4>Painel</h4>
            <div style={{marginTop:8}}>
              <div style={{display:'flex',justifyContent:'space-between'}}><small>Projetos</small><strong>{projects.length}</strong></div>
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <button onClick={load}>Atualizar</button>
              </div>
            </div>
          </div>

          <div style={{marginTop:12,background:'#071427',padding:12,borderRadius:10}}>
            <h4>Contato</h4>
            <ContactForm/>
          </div>
        </aside>
      </main>
    </div>
  );
}

function ProjectForm({onSubmit,initial,onCancel}){
  const [title,setTitle] = useState(initial?.title||'');
  const [description,setDescription] = useState(initial?.description||'');
  const [tags,setTags] = useState((initial?.tags||[]).join(', '));
  const [link,setLink] = useState(initial?.link||'');
  const [date,setDate] = useState(initial?.date||new Date().toISOString().slice(0,10));

  useEffect(()=>{ if(initial){ setTitle(initial.title||''); setDescription(initial.description||''); setTags((initial.tags||[]).join(', ')); setLink(initial.link||''); setDate(initial.date||new Date().toISOString().slice(0,10)); } },[initial]);

  function submit(e){ e.preventDefault(); if(!title) return alert('Título obrigatório'); onSubmit({title,description,tags:tags.split(',').map(t=>t.trim()).filter(Boolean),link,date}); setTitle(''); setDescription(''); setTags(''); setLink(''); }

  return (
    <form onSubmit={submit}>
      <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Link (opcional)" value={link} onChange={e=>setLink(e.target.value)} />
      <input placeholder="Tags (ex: React,API)" value={tags} onChange={e=>setTags(e.target.value)} />
      <textarea placeholder="Descrição" value={description} onChange={e=>setDescription(e.target.value)} />
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button type="button" onClick={onCancel}>Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}

function ContactForm(){
  const [name,setName] = useState(''); const [email,setEmail] = useState(''); const [msg,setMsg] = useState('');
  function submit(e){ e.preventDefault(); if(!email||!msg) return alert('Preencha email e mensagem'); const subject = encodeURIComponent('Contato via PortfolioApp'); const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${msg}`); window.location.href = `mailto:seuemail@exemplo.com?subject=${subject}&body=${body}`; }
  return (
    <form onSubmit={submit}>
      <input placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Seu email" value={email} onChange={e=>setEmail(e.target.value)} />
      <textarea placeholder="Mensagem" value={msg} onChange={e=>setMsg(e.target.value)} />
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
}

export default App;
