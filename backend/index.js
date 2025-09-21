const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET /projects
app.get('/api/projects', async (req, res) => {
  try{
    const rows = await db.all('SELECT * FROM projects ORDER BY id DESC');
    const parsed = rows.map(r => ({...r, tags: r.tags ? JSON.parse(r.tags) : []}));
    res.json(parsed);
  }catch(err){ res.status(500).json({error: err.message}); }
});

// GET /projects/:id
app.get('/api/projects/:id', async (req,res)=>{
  try{ const id = req.params.id; const row = await db.get('SELECT * FROM projects WHERE id = ?', [id]); if(!row) return res.status(404).json({error:'Not found'}); row.tags = row.tags ? JSON.parse(row.tags) : []; res.json(row);}catch(err){res.status(500).json({error:err.message});}
});

// POST /projects
app.post('/api/projects', async (req,res)=>{
  try{
    const {title, description, tags, link, date} = req.body;
    const tagsStr = JSON.stringify(tags || []);
    const result = await db.run('INSERT INTO projects (title,description,tags,link,date) VALUES (?,?,?,?,?)',[title,description,tagsStr,link,date]);
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    project.tags = project.tags ? JSON.parse(project.tags) : [];
    res.status(201).json(project);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// PUT /projects/:id
app.put('/api/projects/:id', async (req,res)=>{
  try{
    const id = req.params.id; const {title,description,tags,link,date} = req.body;
    const tagsStr = JSON.stringify(tags || []);
    await db.run('UPDATE projects SET title=?,description=?,tags=?,link=?,date=? WHERE id=?',[title,description,tagsStr,link,date,id]);
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]); project.tags = project.tags ? JSON.parse(project.tags) : [];
    res.json(project);
  }catch(err){res.status(500).json({error:err.message});}
});

// DELETE /projects/:id
app.delete('/api/projects/:id', async (req,res)=>{
  try{ const id = req.params.id; await db.run('DELETE FROM projects WHERE id=?',[id]); res.json({ok:true}); }catch(err){res.status(500).json({error:err.message});}
});

// Simple health
app.get('/api/health', (req,res)=>res.json({ok:true}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend running on port', PORT));
