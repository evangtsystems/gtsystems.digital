const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
const production = process.env.NODE_ENV === 'production';
const root = process.env.CHAT_DATA_DIR || path.join(__dirname, 'data');
fs.mkdirSync(root, { recursive: true, mode: 0o700 });
const db = new Database(path.join(root, 'conversations.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, name TEXT NOT NULL, email TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', unread INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, conversation_id TEXT NOT NULL REFERENCES conversations(id), sender TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS chat_messages_conversation ON messages(conversation_id, id);
CREATE TABLE IF NOT EXISTS staff_sessions (token_hash TEXT PRIMARY KEY, dashboard_cookie TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS verification_codes (conversation_id TEXT PRIMARY KEY REFERENCES conversations(id), code_hash TEXT NOT NULL, client_id INTEGER NOT NULL, client_name TEXT NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS verification_limits (identity_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS verification_limit_lookup ON verification_limits(identity_hash, created_at);
`);
const conversationColumns = new Set(db.pragma('table_info(conversations)').map(column => column.name));
if (!conversationColumns.has('verified_client_id')) db.exec('ALTER TABLE conversations ADD COLUMN verified_client_id INTEGER');
if (!conversationColumns.has('verified_client_name')) db.exec('ALTER TABLE conversations ADD COLUMN verified_client_name TEXT');
const origins = (process.env.CHAT_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3004,http://localhost:7010').split(',').map(s=>s.trim());
const authOrigin = process.env.DASHBOARD_AUTH_ORIGIN || 'http://127.0.0.1:7001';
const panelOrigin = process.env.CHAT_PANEL_ORIGIN || 'http://localhost:7010';
const userDatabase = process.env.CHAT_USER_DB_NAME && process.env.CHAT_USER_DB_USER ? mysql.createPool({
  host: process.env.CHAT_USER_DB_HOST || '127.0.0.1',
  port: Number(process.env.CHAT_USER_DB_PORT || 3306),
  user: process.env.CHAT_USER_DB_USER,
  password: process.env.CHAT_USER_DB_PASSWORD || '',
  database: process.env.CHAT_USER_DB_NAME,
  connectionLimit: 4,
  connectTimeout: 5000,
}) : null;
const verificationSecret = process.env.CHAT_VERIFICATION_SECRET || (!production ? crypto.randomBytes(32).toString('hex') : '');
const verificationDigest = value => crypto.createHmac('sha256', verificationSecret).update(value).digest('hex');
const validEmail = value => /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(value);
async function sendVerificationEmail(email, code, english) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('Verification email is not configured');
  const sender = process.env.BREVO_SENDER_EMAIL || 'info@gtsystems.gr';
  const text = english
    ? `Your GTSystems chat verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`
    : `Ο κωδικός επιβεβαίωσης για τη συνομιλία με την GTSystems είναι ${code}. Ισχύει για 10 λεπτά. Αν δεν τον ζητήσατε εσείς, αγνοήστε αυτό το email.`;
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method:'POST', headers:{accept:'application/json','api-key':apiKey,'content-type':'application/json'},
    body:JSON.stringify({sender:{name:'GTSystems',email:sender},to:[{email}],subject:english?'GTSystems chat verification code':'Κωδικός επιβεβαίωσης συνομιλίας GTSystems',textContent:text}),
    signal:AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Verification email service failed');
}
async function isActiveUser(user) {
  if (!user?.id) return false;
  if (!userDatabase) return !production;
  const [rows] = await userDatabase.execute('SELECT active FROM users WHERE id = ? LIMIT 1', [user.id]);
  return rows.length === 1 && Number(rows[0].active) === 1;
}
const now = () => new Date().toISOString();
const randomToken = () => crypto.randomBytes(32).toString('base64url');
const hash = t => crypto.createHash('sha256').update(t).digest('hex');
const clean = (s,n) => typeof s === 'string' ? s.trim().slice(0,n) : '';
const limiter = (limit, ms=60000) => rateLimit({windowMs:ms, limit, standardHeaders:true, legacyHeaders:false});
app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'12kb'}));
app.use(cookieParser());
app.use((req,res,next)=>{
  const origin=req.headers.origin;
  if (origin && origins.includes(origin)) {res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Access-Control-Allow-Headers','Content-Type, Authorization');res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');}
  if(req.method==='OPTIONS') return res.sendStatus(origin && origins.includes(origin) ? 204 : 403);
  if(origin && !origins.includes(origin)) return res.status(403).json({error:'Origin not allowed'});
  next();
});
app.use(express.static(path.join(__dirname,'public'),{extensions:['html']}));
async function verifyTurnstile(token){
  const key = process.env.TURNSTILE_SECRET_KEY || (!production ? '1x0000000000000000000000000000000AA' : '');
  if(!key || !token || token.length>2048 || (production && /^[123]x0{10,}/.test(key))) return false;
  try { const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:key,response:token}),signal:AbortSignal.timeout(8000)}); return response.ok && (await response.json()).success===true; } catch {return false;}
}
function visitor(req,res,next){
 const t=(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!/^[A-Za-z0-9_-]{43}$/.test(t)) return res.status(401).json({error:'Unauthorized'});
 req.conversation=db.prepare('SELECT * FROM conversations WHERE token_hash = ?').get(hash(t));
 if(!req.conversation) return res.status(401).json({error:'Unauthorized'}); next();
}
async function staff(req,res,next){
 const token=req.cookies.gts_chat_session || '';
 if(!/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(401).json({error:'Unauthorized'});
 const session=db.prepare('SELECT * FROM staff_sessions WHERE token_hash=? AND expires_at>?').get(hash(token),Date.now());
 if(!session) return res.status(401).json({error:'Unauthorized'});
 try { const result=await fetch(new URL('/api/me',authOrigin),{headers:{cookie:session.dashboard_cookie},signal:AbortSignal.timeout(5000)}); if(!result.ok) return res.status(401).json({error:'Unauthorized'}); const body=await result.json(); if(!(await isActiveUser(body.user))) return res.status(403).json({error:'Account inactive or unavailable'}); req.staff=body.user; next(); } catch {return res.status(503).json({error:'Sign-in service unavailable'});}
}
function panelWrite(req,res,next){ if(req.headers.origin !== panelOrigin) return res.status(403).json({error:'Origin not allowed'});next(); }
app.post('/api/staff/login',panelWrite,limiter(10,900000),async(req,res)=>{
 const username=clean(req.body?.username,180), password=typeof req.body?.password === 'string' ? req.body.password : '';
 if(password.length>256) return res.status(400).json({error:'Invalid credentials'});
 if(!username || !password) return res.status(400).json({error:'Enter your account details'});
 try {
  const r=await fetch(new URL('/api/login',authOrigin),{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-Proto':'https'},body:JSON.stringify({username,password}),signal:AbortSignal.timeout(8000)});
  if(!r.ok) return res.status(r.status===429?429:401).json({error:'Unable to sign in'});
  const body=await r.json(); const upstream=(r.headers.get('set-cookie')||'').split(';')[0];
  if(!upstream || !(await isActiveUser(body.user))) return res.status(403).json({error:'Account inactive or unavailable'});
  const token=randomToken(); db.prepare('DELETE FROM staff_sessions WHERE expires_at < ?').run(Date.now());
  db.prepare('INSERT INTO staff_sessions VALUES (?,?,?)').run(hash(token),upstream,Date.now()+8*3600000);
  res.cookie('gts_chat_session',token,{httpOnly:true,secure:production,sameSite:'strict',path:'/',maxAge:8*3600000});res.json({user:{name:body.user.full_name || body.user.username}});
 } catch {res.status(503).json({error:'Sign-in service unavailable'});}
});
app.post('/api/staff/logout',panelWrite,staff,(req,res)=>{ db.prepare('DELETE FROM staff_sessions WHERE token_hash=?').run(hash(req.cookies.gts_chat_session));res.clearCookie('gts_chat_session',{httpOnly:true,secure:production,sameSite:'strict',path:'/'});res.json({ok:true}); });
app.get('/api/staff/me',staff,(req,res)=>res.json({user:{name:req.staff.full_name || req.staff.username}}));
app.post('/api/conversations',limiter(6,600000),async(req,res)=>{
 const name=clean(req.body?.name,100), email=clean(req.body?.email,180), text=clean(req.body?.message,2000);
 if(!name || !text || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({error:'Please provide a name and message, and a valid email if supplied.'});
 if(!(await verifyTurnstile(clean(req.body?.turnstile,2048)))) return res.status(403).json({error:'Verification failed'});
 const id=crypto.randomUUID(), token=randomToken(), date=now();
 db.transaction(()=>{db.prepare('INSERT INTO conversations (id,token_hash,name,email,created_at,updated_at,unread) VALUES (?,?,?,?,?,?,1)').run(id,hash(token),name,email,date,date);db.prepare('INSERT INTO messages (conversation_id,sender,body,created_at) VALUES (?,\'visitor\',?,?)').run(id,text,date);})();
 res.status(201).json({token});
});
app.get('/api/conversation',limiter(90),visitor,(req,res)=>{res.set('Cache-Control','no-store');res.json({status:req.conversation.status,verified:Boolean(req.conversation.verified_client_id),messages:db.prepare('SELECT id,sender,body,created_at FROM messages WHERE conversation_id=? ORDER BY id').all(req.conversation.id)});});
app.post('/api/conversation/verification/start',limiter(10,900000),visitor,async(req,res)=>{
 const vat=clean(req.body?.vat,20), timestamp=Date.now();
 if(!userDatabase || !verificationSecret || !process.env.BREVO_API_KEY) return res.status(503).json({error:'Verification unavailable'});
 const generic=()=>res.json({ok:true});
 db.prepare('DELETE FROM verification_limits WHERE created_at < ?').run(timestamp-3600000);
 const identity=verificationDigest('vat:'+vat);
 const recent=db.prepare('SELECT COUNT(*) AS n FROM verification_limits WHERE identity_hash=? AND created_at>?').get(identity,timestamp-3600000).n;
 if(recent>=3) return generic();
 db.prepare('INSERT INTO verification_limits (identity_hash,created_at) VALUES (?,?)').run(identity,timestamp);
 db.prepare('DELETE FROM verification_codes WHERE conversation_id=?').run(req.conversation.id);
 if(!/^\d{9}$/.test(vat)) return generic();
 try {
  const [clients]=await userDatabase.execute('SELECT id, company_name, email FROM clients WHERE TRIM(vat)=? AND merged_into IS NULL LIMIT 2',[vat]);
  if(clients.length!==1) return generic();
  const client=clients[0], email=typeof client.email === 'string' ? client.email.trim() : '', clientName=clean(client.company_name,160);
  if(email.length>180 || !validEmail(email)) return generic();
  const code=String(crypto.randomInt(0,1000000)).padStart(6,'0');
  const digest=verificationDigest(req.conversation.id+':'+code);
  db.prepare('INSERT INTO verification_codes (conversation_id,code_hash,client_id,client_name,expires_at) VALUES (?,?,?,?,?)').run(req.conversation.id,digest,client.id,clientName,timestamp+600000);
  // Keep the response identical for known and unknown VAT numbers.
  sendVerificationEmail(email,code,req.body?.locale==='en').catch(()=>console.error('[CHAT_VERIFICATION_EMAIL_ERROR]'));
  return generic();
 } catch { console.error('[CHAT_VERIFICATION_LOOKUP_ERROR]'); return generic(); }
});
app.post('/api/conversation/verification/confirm',limiter(20,900000),visitor,(req,res)=>{
 const code=clean(req.body?.code,10);
 const row=db.prepare('SELECT * FROM verification_codes WHERE conversation_id=?').get(req.conversation.id);
 if(!verificationSecret || !row || row.expires_at<=Date.now() || row.attempts>=5 || !/^\d{6}$/.test(code)) return res.status(400).json({error:'Invalid or expired code'});
 const expected=Buffer.from(row.code_hash,'hex'),actual=Buffer.from(verificationDigest(req.conversation.id+':'+code),'hex');
 if(expected.length!==actual.length || !crypto.timingSafeEqual(expected,actual)){
  db.prepare('UPDATE verification_codes SET attempts=attempts+1 WHERE conversation_id=?').run(req.conversation.id);
  return res.status(400).json({error:'Invalid or expired code'});
 }
 db.transaction(()=>{db.prepare('UPDATE conversations SET verified_client_id=?, verified_client_name=? WHERE id=?').run(row.client_id,row.client_name,req.conversation.id);db.prepare('DELETE FROM verification_codes WHERE conversation_id=?').run(req.conversation.id);})();
 res.json({verified:true});
});
app.post('/api/conversation/messages',limiter(20),visitor,(req,res)=>{
 const text=clean(req.body?.message,2000);if(!text) return res.status(400).json({error:'Message is required'});const date=now();
 db.transaction(()=>{db.prepare('INSERT INTO messages (conversation_id,sender,body,created_at) VALUES (?,\'visitor\',?,?)').run(req.conversation.id,text,date);db.prepare("UPDATE conversations SET updated_at=?, status='open', unread=unread+1 WHERE id=?").run(date,req.conversation.id);})();res.status(201).json({ok:true});
});
app.get('/api/staff/conversations',staff,(req,res)=>{res.set('Cache-Control','no-store');res.json({conversations:db.prepare('SELECT id,name,email,created_at,updated_at,status,unread,verified_client_id,verified_client_name FROM conversations ORDER BY updated_at DESC LIMIT 200').all()});});
app.get('/api/staff/conversations/:id',staff,(req,res)=>{const c=db.prepare('SELECT id,name,email,created_at,updated_at,status,unread,verified_client_id,verified_client_name FROM conversations WHERE id=?').get(req.params.id);if(!c)return res.sendStatus(404);res.set('Cache-Control','no-store');res.json({conversation:c,messages:db.prepare('SELECT id,sender,body,created_at FROM messages WHERE conversation_id=? ORDER BY id').all(c.id)});});
app.post('/api/staff/conversations/:id/read',panelWrite,staff,(req,res)=>{db.prepare('UPDATE conversations SET unread=0 WHERE id=?').run(req.params.id);res.json({ok:true});});
app.post('/api/staff/conversations/:id/reply',panelWrite,staff,(req,res)=>{const text=clean(req.body?.message,2000);if(!text)return res.status(400).json({error:'Message is required'});const c=db.prepare('SELECT id FROM conversations WHERE id=?').get(req.params.id);if(!c)return res.sendStatus(404);const date=now();db.transaction(()=>{db.prepare('INSERT INTO messages (conversation_id,sender,body,created_at) VALUES (?,\'staff\',?,?)').run(c.id,text,date);db.prepare("UPDATE conversations SET updated_at=?,status='open' WHERE id=?").run(date,c.id);})();res.status(201).json({ok:true});});
app.post('/api/staff/conversations/:id/resolve',panelWrite,staff,(req,res)=>{db.prepare("UPDATE conversations SET status='resolved',unread=0,updated_at=? WHERE id=?").run(now(),req.params.id);res.json({ok:true});});
if(require.main===module) app.listen(Number(process.env.PORT||7010),'127.0.0.1',()=>console.log(`Chat listening on port ${process.env.PORT||7010}`));
module.exports = {app,db};
