const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
process.env.CHAT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'gts-chat-test-'));
process.env.CHAT_PANEL_ORIGIN = 'http://localhost:7010';
process.env.CHAT_ALLOWED_ORIGINS = 'http://localhost:7010,http://localhost:3000';
process.env.DASHBOARD_AUTH_ORIGIN = 'http://127.0.0.1:7111';
process.env.CHAT_USER_DB_NAME = 'test_db';
process.env.CHAT_USER_DB_USER = 'test_user';
process.env.CHAT_VERIFICATION_SECRET = 'test-only-verification-secret';
process.env.BREVO_API_KEY = 'test-only-mail-key';
const mysql = require('mysql2/promise');
mysql.createPool = () => ({ execute: async (sql, values) => {
 if (sql.includes('FROM users')) return [[{active:1}]];
 if (sql.includes('FROM clients')) return [values[0] === '012345678' ? [{id:7,company_name:'Example Customer',email:'registered@example.com'}] : []];
 throw new Error('Unexpected query');
} });
let lastEmail;
const originalFetch = global.fetch;
global.fetch = async (url, options={}) => {
 const target=String(url);
 if(target.includes('challenges.cloudflare.com')) return new Response(JSON.stringify({success:options.body.get('response')==='valid-test-token'}),{status:200});
 if(target==='https://api.brevo.com/v3/smtp/email'){lastEmail=JSON.parse(options.body);return new Response('{}',{status:201});}
 if(target==='http://127.0.0.1:7111/api/login') return new Response(JSON.stringify({user:{id:42,role:'technician',username:'tester',full_name:'Test Admin'}}),{status:200,headers:{'set-cookie':'dashboard_session=test; HttpOnly'}});
 if(target==='http://127.0.0.1:7111/api/me') return new Response(JSON.stringify({user:{id:42,role:'technician',username:'tester',full_name:'Test Admin'}}),{status:200});
 return originalFetch(url,options);
};
const { app, db } = require('./server');
const server=app.listen(0,'127.0.0.1');
after(()=>{server.close();db.close();fs.rmSync(process.env.CHAT_DATA_DIR,{recursive:true,force:true});global.fetch=originalFetch;});
const root=()=>`http://127.0.0.1:${server.address().port}`;
async function req(path,{origin='http://localhost:3000',cookie,token,...rest}={}){return originalFetch(root()+path,{...rest,headers:{Origin:origin,...(rest.body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{}),...(token?{Authorization:`Bearer ${token}`}:{})}})}
const post=(path,body,extra={})=>req(path,{...extra,method:'POST',body:JSON.stringify(body)});
test('public submissions require verification and staff endpoints require a session',async()=>{
 let r=await post('/api/conversations',{name:'Client',message:'Hello',turnstile:'bad'});assert.equal(r.status,403);
 r=await req('/api/staff/conversations');assert.equal(r.status,401);
 r=await post('/api/conversations',{name:'Client',message:'Hello',turnstile:'valid-test-token'},{origin:'https://evil.example'});assert.equal(r.status,403);
});
test('visitor and active dashboard user can exchange messages without exposing other conversations',async()=>{
 let r=await post('/api/conversations',{name:'Client',email:'client@example.com',message:'Hello',turnstile:'valid-test-token'});assert.equal(r.status,201);const {token}=await r.json();assert.ok(token);
 r=await req('/api/conversation',{token});assert.equal(r.status,200);assert.equal((await r.json()).messages[0].body,'Hello');
 r=await req('/api/conversation',{token:'wrong'});assert.equal(r.status,401);
 r=await post('/api/staff/login',{username:'tester',password:'password'},{origin:'http://localhost:7010'});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];
 r=await req('/api/staff/conversations',{cookie,origin:'http://localhost:7010'});const list=await r.json();assert.equal(list.conversations.length,1);const id=list.conversations[0].id;
 r=await post(`/api/staff/conversations/${id}/reply`,{message:'We can help'},{cookie,origin:'http://localhost:7010'});assert.equal(r.status,201);
 r=await req('/api/conversation',{token});const conversation=await r.json();assert.equal(conversation.messages[1].body,'We can help');
 r=await post(`/api/staff/conversations/${id}/resolve`,{},{cookie,origin:'http://localhost:3000'});assert.equal(r.status,403);
});
test('VAT verification sends a one-time code only to the registered address and proves access',async()=>{
 let r=await post('/api/conversations',{name:'Existing customer',message:'Hello',turnstile:'valid-test-token'});const {token}=await r.json();
 r=await post('/api/conversation/verification/start',{vat:'012345678'},{token});assert.equal(r.status,200);const known=await r.json();assert.deepEqual(known,{ok:true});
 assert.equal(lastEmail.to[0].email,'registered@example.com');
 const code=lastEmail.textContent.match(/\b\d{6}\b/)[0];
 r=await post('/api/conversation/verification/confirm',{code:code==='000000'?'000001':'000000'},{token});assert.equal(r.status,400);
 r=await post('/api/conversation/verification/confirm',{code},{token});assert.equal(r.status,200);
 r=await req('/api/conversation',{token});const conversation=await r.json();assert.equal(conversation.verified,true);assert.equal(JSON.stringify(conversation).includes('registered@example.com'),false);assert.equal(JSON.stringify(conversation).includes('012345678'),false);
 r=await post('/api/conversation/verification/confirm',{code},{token});assert.equal(r.status,400);
 r=await post('/api/conversations',{name:'Unknown',message:'Hello',turnstile:'valid-test-token'});const unknown=(await r.json()).token;
 lastEmail=null;r=await post('/api/conversation/verification/start',{vat:'999999999'},{token:unknown});assert.deepEqual(await r.json(),known);assert.equal(lastEmail,null);
});
test('verification locks after five incorrect codes and does not reveal a customer match',async()=>{
 let r=await post('/api/conversations',{name:'Visitor',message:'Hello',turnstile:'valid-test-token'});const {token}=await r.json();
 await post('/api/conversation/verification/start',{vat:'012345678'},{token});const code=lastEmail.textContent.match(/\b\d{6}\b/)[0];const wrong=code==='000000'?'000001':'000000';
 for(let i=0;i<5;i++){r=await post('/api/conversation/verification/confirm',{code:wrong},{token});assert.equal(r.status,400);}
 r=await post('/api/conversation/verification/confirm',{code},{token});assert.equal(r.status,400);
 r=await req('/api/conversation',{token});assert.equal((await r.json()).verified,false);
});
test('expired verification codes are rejected',async()=>{
 const crypto=require('node:crypto');
 let r=await post('/api/conversations',{name:'Visitor',message:'Hello',turnstile:'valid-test-token'});const {token}=await r.json();
 await post('/api/conversation/verification/start',{vat:'012345678'},{token});const code=lastEmail.textContent.match(/\b\d{6}\b/)[0];
 const tokenHash=crypto.createHash('sha256').update(token).digest('hex');const conversation=db.prepare('SELECT id FROM conversations WHERE token_hash=?').get(tokenHash);
 db.prepare('UPDATE verification_codes SET expires_at=? WHERE conversation_id=?').run(Date.now()-1,conversation.id);
 r=await post('/api/conversation/verification/confirm',{code},{token});assert.equal(r.status,400);
});

