const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const HEROES = require('./heroes');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.use(express.static(path.join(__dirname, '..', 'client')));

const rooms = new Map();
const MAX_PLAYERS = 4;
const START_HP = 10;

function roomCode() {
  let code;
  do code = Math.random().toString(36).slice(2, 6).toUpperCase(); while (rooms.has(code));
  return code;
}
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }
function draw(p, count = 1) {
  for (let i = 0; i < count; i++) {
    if (!p.deck.length) {
      if (!p.discard.length) break;
      p.deck = shuffle(p.discard); p.discard = [];
    }
    const card = p.deck.pop(); if (card) p.hand.push(card);
  }
}
function publicState(room, socketId) {
  const me = room.players.findIndex(p => p && p.uid === socketId);
  return {
    roomCode: room.code, hostUid: room.hostUid, phase: room.phase,
    currentTurnIndex: room.currentTurnIndex, playsRemaining: room.playsRemaining,
    mySlotIndex: me,
    logs: room.logs.slice(-80),
    players: room.players.map(p => p ? ({
      uid: p.uid, name: p.name, heroId: p.heroId, isAI: false,
      hp: p.hp, hand: p.uid === socketId ? p.hand : [], handCount: p.hand.length,
      discardCount: p.discard.length, shields: p.shields, connected: !!io.sockets.sockets.get(p.uid)
    }) : ({uid:null,name:'Open Slot',heroId:null,isAI:false,hp:10,hand:[],handCount:0,discardCount:0,shields:[],connected:false}))
  };
}
function broadcast(room) {
  for (const p of room.players) if (p && io.sockets.sockets.has(p.uid)) io.to(p.uid).emit('roomState', publicState(room, p.uid));
}
function error(socket, msg) { socket.emit('errorMessage', msg); }
function alive(room) { return room.players.filter(Boolean).filter(p => p.hp > 0); }
function nextTurn(room) {
  if (room.phase !== 'playing') return;
  let i = room.currentTurnIndex;
  do i = (i + 1) % room.players.length; while (room.players[i] && room.players[i].hp <= 0 && alive(room).length > 1);
  room.currentTurnIndex = i;
  room.playsRemaining = 1;
  const p = room.players[i];
  if (p) {
    draw(p, 1);
    if (!p.hand.length) draw(p, 3);
    room.logs.push(`--- <strong>${p.name}</strong>'s Turn ---`);
  }
  checkWin(room);
}
function checkWin(room) {
  const a = alive(room);
  if (a.length <= 1) {
    room.phase = 'finished';
    if (a[0]) room.logs.push(`🏆 <strong>${a[0].name}</strong> wins the battle!`);
  }
}
function targetOptions(room, player, kind) {
  if (kind === 'swap') return room.players.filter(p => p && p.uid !== player.uid && p.hp > 0).map(p => ({type:'player',playerIndex:p.index,label:`Swap with ${p.name} (${p.hp} HP)`}));
  const out=[];
  room.players.forEach(p => {
    if (!p || p.index === player.index || p.hp <= 0) return;
    if (p.shields.length) p.shields.forEach((s,i)=>out.push({type:'shield',playerIndex:p.index,shieldIndex:i,label:`🛡️ ${p.name}'s Shield: ${s.name} (${s.hp} HP)`}));
    else out.push({type:'player',playerIndex:p.index,label:`⚔️ ${p.name} (HP: ${p.hp})`});
  });
  return out;
}
function applyTarget(room, player, target) {
  const pending = room.pending;
  if (!pending || pending.uid !== player.uid) return error(io.sockets.sockets.get(player.uid), 'No target is pending.');
  if (pending.kind === 'swap') {
    const t=room.players[target.playerIndex];
    if (!t || t.hp<=0 || t.uid===player.uid) return error(io.sockets.sockets.get(player.uid), 'Invalid target.');
    [player.hp,t.hp]=[t.hp,player.hp];
    room.logs.push(`🪄 <strong>${player.name}</strong> SWAPPED Hit Points with ${t.name}!`);
  } else {
    const t=room.players[target.playerIndex];
    if (!t || t.hp<=0 || t.index===player.index) return error(io.sockets.sockets.get(player.uid), 'Invalid target.');
    const damage=pending.damage;
    if (target.type==='shield') {
      const shield=t.shields[target.shieldIndex];
      if (!shield) return error(io.sockets.sockets.get(player.uid), 'That shield is no longer available.');
      shield.hp-=damage;
      room.logs.push(`⚔️ ${player.name} attacked ${t.name}'s shield <strong>[${shield.name}]</strong> for ${damage} damage!`);
      if (shield.hp<=0) t.shields.splice(target.shieldIndex,1);
    } else {
      t.hp=Math.max(0,t.hp-damage);
      room.logs.push(`⚔️ ${player.name} attacked <strong>${t.name}</strong> for ${damage} damage!`);
      if (t.hp<=0) room.logs.push(`💀 <strong>${t.name}</strong> was ELIMINATED!`);
    }
  }
  room.pending=null;
  checkWin(room);
  if (room.phase==='playing') finishAction(room, player);
}
function finishAction(room, player) {
  if (room.phase!=='playing') return;
  if (room.playsRemaining<=0 || !player.hand.length) nextTurn(room);
}
function startGame(room) {
  const occupied=room.players.filter(Boolean);
  if (occupied.length<2) return false;
  const heroes=new Set();
  for (const p of occupied) { if (!HEROES[p.heroId] || heroes.has(p.heroId)) return false; heroes.add(p.heroId); }
  room.phase='playing'; room.currentTurnIndex=0; room.playsRemaining=1; room.pending=null;
  room.logs.push('🎮 Host launched the match! Battle Begins!');
  for (const p of occupied) { p.hp=START_HP; p.deck=shuffle(HEROES[p.heroId].deck); p.hand=[]; p.discard=[]; p.shields=[]; draw(p,3); }
  const first=room.players[0]; if (first) { draw(first,1); room.logs.push(`--- <strong>${first.name}</strong>'s Turn ---`); }
  return true;
}
function handlePlayCard(room, socket, cardIndex) {
  const p=room.players[room.currentTurnIndex];
  if (!p || p.uid!==socket.id) return error(socket,'It is not your turn.');
  if (room.playsRemaining<=0 || room.pending) return error(socket,'You cannot play a card right now.');
  const card=p.hand[cardIndex]; if (!card) return error(socket,'That card is not in your hand.');
  p.hand.splice(cardIndex,1); p.discard.push(card); room.playsRemaining--;
  room.logs.push(`<strong>${p.name}</strong> played <strong>[${card.name}]</strong>!`);
  const icons=card.icons||[];
  room.playsRemaining += icons.filter(x=>x==='bolt').length;
  draw(p, icons.filter(x=>x==='draw').length);
  const heals=icons.filter(x=>x==='heal').length; if (heals) p.hp=Math.min(START_HP,p.hp+heals);
  if (card.shieldHp>0) p.shields.push({cardId:card.id,name:card.name,hp:card.shieldHp,maxHp:card.shieldHp});
  if (icons.includes('special_full_heal')) p.hp=START_HP;
  if (icons.includes('special_smash')) { let n=0; room.players.forEach(t=>{if(t&&t.uid!==p.uid){n+=t.shields.length;t.shields=[];}}); room.logs.push(`💥 <strong>${p.name}</strong> smashed and destroyed ALL ${n} opponent shields!`); }
  if (icons.includes('special_steal')) draw(p,2);
  if (icons.includes('special_swap')) {
    room.pending={uid:p.uid,kind:'swap'};
    const opts=targetOptions(room,p,'swap');
    if (opts.length) socket.emit('targetOptions',{title:'✨ Swap Hit Points!',description:'Choose an opponent.',options:opts}); else {room.pending=null;finishAction(room,p);}
    return;
  }
  const attacks=icons.filter(x=>x==='attack').length;
  if (attacks) {
    room.pending={uid:p.uid,kind:'attack',damage:attacks};
    const opts=targetOptions(room,p,'attack');
    if (opts.length) socket.emit('targetOptions',{title:`Select Target (${attacks} Damage)`,description:'Select an opponent or active shield.',options:opts}); else {room.pending=null;finishAction(room,p);}
    return;
  }
  finishAction(room,p);
}

io.on('connection', socket => {
  socket.on('createRoom', ({playerName='Player 1 (Host)',heroId='AZZAN'}) => {
    const code=roomCode();
    const p={uid:socket.id,name:playerName,heroId, index:0,hp:START_HP,deck:[],hand:[],discard:[],shields:[]};
    const room={code,hostUid:socket.id,phase:'lobby',currentTurnIndex:0,playsRemaining:1,pending:null,players:[p,null,null,null],logs:[`Room ${code} created. Waiting for players...`]};
    rooms.set(code,room); socket.join(code); broadcast(room);
  });
  socket.on('joinRoom', ({roomCode,playerName='Player',heroId='LIA'}) => {
    const room=rooms.get(String(roomCode||'').toUpperCase()); if(!room) return error(socket,'Room not found.');
    if(room.phase!=='lobby') return error(socket,'That match has already started.');
    const idx=room.players.findIndex(p=>!p); if(idx<0) return error(socket,'Room is full.');
    room.players[idx]={uid:socket.id,name:playerName||`Player ${idx+1}`,heroId,index:idx,hp:START_HP,deck:[],hand:[],discard:[],shields:[]};
    room.logs.push(`${room.players[idx].name} joined Slot ${idx+1}.`); socket.join(room.code); broadcast(room);
  });
  socket.on('selectHero', ({heroId}) => {
    const room=[...rooms.values()].find(r=>r.players.some(p=>p&&p.uid===socket.id)); if(!room||!HEROES[heroId]||room.phase!=='lobby') return;
    const p=room.players.find(p=>p&&p.uid===socket.id); if(room.players.some(q=>q&&q.uid!==socket.id&&q.heroId===heroId)) return error(socket,'That hero is already taken.');
    p.heroId=heroId; broadcast(room);
  });
  socket.on('startGame', () => {
    const room=[...rooms.values()].find(r=>r.players.some(p=>p&&p.uid===socket.id)); if(!room) return;
    if(room.hostUid!==socket.id) return error(socket,'Only the host can start the match.');
    if(!startGame(room)) return error(socket,'You need at least 2 players and each player must have a different hero.');
    broadcast(room);
  });
  socket.on('playCard', ({cardIndex}) => {
    const room=[...rooms.values()].find(r=>r.players.some(p=>p&&p.uid===socket.id)); if(!room||room.phase!=='playing') return;
    handlePlayCard(room,socket,Number(cardIndex)); broadcast(room);
  });
  socket.on('resolveTarget', ({target}) => {
    const room=[...rooms.values()].find(r=>r.players.some(p=>p&&p.uid===socket.id)); if(!room||room.phase!=='playing') return;
    applyTarget(room,room.players.find(p=>p&&p.uid===socket.id),target); broadcast(room);
  });
  socket.on('cancelTarget', () => {
    const room=[...rooms.values()].find(r=>r.players.some(p=>p&&p.uid===socket.id)); if(!room||!room.pending||room.pending.uid!==socket.id)return;
    room.pending=null; finishAction(room,room.players.find(p=>p&&p.uid===socket.id)); broadcast(room);
  });
  socket.on('leaveRoom', () => leave(socket));
  socket.on('disconnect', () => leave(socket));
});
function leave(socket){
  for(const [code,room] of rooms){
    const idx=room.players.findIndex(p=>p&&p.uid===socket.id); if(idx<0)continue;
    if(room.phase==='lobby'){ room.players[idx]=null; room.logs.push(`Player ${idx+1} left the room.`); if(room.hostUid===socket.id){const n=room.players.find(p=>p); room.hostUid=n?n.uid:null;} if(room.players.filter(Boolean).length===0){rooms.delete(code);return;} broadcast(room); }
    else { const p=room.players[idx]; if(p)p.connected=false; broadcast(room); }
  }
}

const PORT=process.env.PORT||3000;
httpServer.listen(PORT, '0.0.0.0', ()=>console.log(`Dungeon Mayhem online server listening on port ${PORT}`));
