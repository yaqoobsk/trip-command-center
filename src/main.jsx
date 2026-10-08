import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {MapPin, CalendarDays, CheckSquare, Wallet, Hotel, Car, Baby, FileText, Plus, Trash2, ExternalLink, ChevronRight, Search, X, Plane, Utensils, CloudSun, AlertTriangle} from 'lucide-react';
import './styles.css';

const initialTrip={
 id:'mahabaleshwar-2026', title:'Mahabaleshwar + Panchgani Road Trip', dates:'17–20 Oct 2026', status:'Booked', route:'Hyderabad → Solapur → Panchgani/Mahabaleshwar → Hyderabad', budget:60000,
 hotels:[
  {date:'17 Oct',name:'Hotel Pratham, Solapur',note:'Overnight stop'},
  {date:'18–19 Oct',name:'Terra on a Hill, Panchgani',note:'2 nights · Bhilar–Akhegani Road'}
 ], days:[
  {date:'17 Oct',title:'Hyderabad → Solapur',items:['05:00–05:30 leave Hyderabad','Breakfast/tea around Zaheerabad–Humnabad','Fuel + lunch near Solapur','Check in Hotel Pratham and rest','Early dinner and sleep']},
  {date:'18 Oct',title:'Solapur → Terra on a Hill',items:['07:00 breakfast and checkout','Drive toward Satara/Wai with baby break','Lunch/fuel stop','Continue to Panchgani/Bhilar–Akhegani','Check in Terra and relax','Dinner and rest']},
  {date:'19 Oct',title:'Panchgani + Mahabaleshwar sightseeing',items:['Terra → Table Land','Parsi Point','Strawberry farm visit','Mapro Garden','Lunch on the way','Venna Lake','Return to Terra and pack']},
  {date:'20 Oct',title:'Panchgani → Hyderabad',items:['05:00 leave Terra','Breakfast/baby break around Satara/Wai','Fuel + lunch near Solapur','Break around Umarga','Humnabad/Zaheerabad break','Target Hyderabad arrival around evening']}
 ]
};
const baseChecklist=[
 ['Baby','Diapers — 10–12/day + 5 extra'],['Baby','Wipes'],['Baby','Changing mat'],['Baby','2–3 clothing changes/day'],['Baby','Warm layer + socks'],['Baby','Feeding bottles / regular food'],['Baby','Blanket / comfort item'],['Baby','Baby carrier'],['Baby','Regular baby medicines + thermometer'],
 ['Clothes','4 tops each'],['Clothes','2 trousers/jeans each'],['Clothes','Nightwear'],['Clothes','Light jacket/hoodie'],['Clothes','Comfortable walking shoes'],['Clothes','Slippers'],['Clothes','Rain jacket / umbrella'],
 ['Health','Personal medicines'],['Health','ORS'],['Health','Band-aids / antiseptic'],['Health','Sunscreen'],['Health','Mosquito repellent'],
 ['Car','Driving licence'],['Car','RC + insurance + PUC'],['Car','FASTag'],['Car','Spare tyre + jack'],['Car','Tyre inflator'],['Car','Puncture repair kit'],['Car','Car charger + cables'],['Car','Phone holder'],['Car','Torch'],['Car','Garbage bags'],
 ['Money & Docs','Hotel confirmations'],['Money & Docs','Credit cards + UPI'],['Money & Docs','₹5,000–₹7,000 emergency cash'],['Money & Docs','ID documents'],
 ['Food','Water bottles'],['Food','Baby food / feeding water'],['Food','Fruits / snacks'],['Food','ORS'],['Food','Zip-lock / waste bags'],
 ['Electronics','Power bank'],['Electronics','Phone chargers'],['Electronics','Camera / memory card'],['Electronics','Offline maps downloaded']
].map(([cat,text],i)=>({id:'c'+i,cat,text}));

function App(){
 const [tab,setTab]=useState('overview');
 const [trip,setTrip]=useState(()=>JSON.parse(localStorage.getItem('tcc_trip')||'null')||initialTrip);
 const [checks,setChecks]=useState(()=>JSON.parse(localStorage.getItem('tcc_checks')||'{}'));
 const [expenses,setExpenses]=useState(()=>JSON.parse(localStorage.getItem('tcc_expenses')||'[]'));
 const [query,setQuery]=useState('');
 const [showAdd,setShowAdd]=useState(false);
 useEffect(()=>localStorage.setItem('tcc_trip',JSON.stringify(trip)),[trip]);
 useEffect(()=>localStorage.setItem('tcc_checks',JSON.stringify(checks)),[checks]);
 useEffect(()=>localStorage.setItem('tcc_expenses',JSON.stringify(expenses)),[expenses]);
 const done=Object.values(checks).filter(Boolean).length, total=baseChecklist.length, progress=Math.round(done/total*100);
 const spent=expenses.reduce((s,e)=>s+Number(e.amount||0),0), remaining=trip.budget-spent;
 const nav=[['overview','Overview',CalendarDays],['itinerary','Itinerary',MapPin],['checklist','Checklist',CheckSquare],['budget','Budget',Wallet],['stays','Hotels',Hotel],['essentials','Trip Essentials',Car]];
 const filtered=baseChecklist.filter(x=>(x.text+' '+x.cat).toLowerCase().includes(query.toLowerCase()));
 const toggle=id=>setChecks(v=>({...v,[id]:!v[id]}));
 const addExpense=e=>{e.preventDefault();const f=new FormData(e.currentTarget);setExpenses(v=>[...v,{id:crypto.randomUUID(),name:f.get('name'),amount:Number(f.get('amount')),cat:f.get('cat')}]);e.currentTarget.reset();setShowAdd(false)};
 return <div className="app">
  <aside className="sidebar"><div className="brand"><div className="logo">✈</div><div><b>Trip Command</b><span>Center</span></div></div><div className="tripmini"><span className="dot"></span><div><strong>Mahabaleshwar</strong><small>17–20 Oct 2026</small></div></div><nav>{nav.map(([id,label,Icon])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><Icon size={18}/>{label}</button>)}</nav><div className="sidefoot">Saved locally on this device<br/><span>GitHub Pages ready</span></div></aside>
  <main><header><div><p className="eyebrow">TRIP COMMAND CENTER</p><h1>{trip.title}</h1><p className="muted">{trip.route}</p></div><div className="header-actions"><span className="status">● {trip.status}</span><button className="iconbtn" onClick={()=>setTab('checklist')} title="Checklist"><CheckSquare size={18}/></button></div></header>
  {tab==='overview'&&<Overview trip={trip} progress={progress} spent={spent} remaining={remaining} setTab={setTab}/>} 
  {tab==='itinerary'&&<Itinerary trip={trip}/>} 
  {tab==='checklist'&&<Checklist checks={checks} toggle={toggle} query={query} setQuery={setQuery} progress={progress} done={done} total={total}/>} 
  {tab==='budget'&&<Budget trip={trip} expenses={expenses} spent={spent} remaining={remaining} showAdd={showAdd} setShowAdd={setShowAdd} addExpense={addExpense} setExpenses={setExpenses}/>} 
  {tab==='stays'&&<Stays hotels={trip.hotels}/>} 
  {tab==='essentials'&&<Essentials/>}
  </main></div>
}
function Overview({trip,progress,spent,remaining,setTab}){return <><section className="hero"><div><span className="pill">ROAD TRIP · FAMILY</span><h2>Everything for your trip, in one place.</h2><p>Itinerary, packing, bookings and budget — without hunting through WhatsApp or notes.</p><div className="heroBtns"><button onClick={()=>setTab('itinerary')}>Open itinerary <ChevronRight size={16}/></button><button className="secondary" onClick={()=>setTab('checklist')}>Packing checklist</button></div></div><div className="routecard"><div className="routeLine"><span>HYD</span><i></i><span>SOL</span><i></i><span>PCH</span><i></i><span>HYD</span></div><small>17–20 October 2026</small></div></section>
<div className="stats"><Stat icon={CalendarDays} label="Trip dates" value="4 days"/><Stat icon={MapPin} label="Sightseeing" value="~40 km"/><Stat icon={CheckSquare} label="Packing" value={`${progress}%`}/><Stat icon={Wallet} label="Budget left" value={`₹${Math.max(0,remaining).toLocaleString('en-IN')}`}/></div>
<section className="grid2"><div className="card"><div className="cardhead"><h3>Next up</h3><span>19 Oct</span></div><h2>Table Land → Parsi Point → Strawberry Farm → Mapro → Venna Lake</h2><p className="muted">A compact sightseeing loop designed to avoid unnecessary backtracking.</p><button className="textbtn" onClick={()=>setTab('itinerary')}>View day plan <ChevronRight size={15}/></button></div><div className="card"><div className="cardhead"><h3>Booking snapshot</h3><Hotel size={18}/></div><Booking name="Hotel Pratham, Solapur" date="17 Oct"/><Booking name="Terra on a Hill, Panchgani" date="18–19 Oct"/></div></section></>}
function Stat({icon:Icon,label,value}){return <div className="stat"><Icon size={20}/><div><small>{label}</small><strong>{value}</strong></div></div>}
function Booking({name,date}){return <div className="booking"><div className="hotelicon"><Hotel size={17}/></div><div><b>{name}</b><small>{date}</small></div><ChevronRight size={16}/></div>}
function Itinerary({trip}){return <section><div className="sectiontitle"><div><p className="eyebrow">DAY BY DAY</p><h2>Itinerary</h2></div><span className="pill">Family paced</span></div><div className="timeline">{trip.days.map((d,i)=><div className="day" key={d.date}><div className="dayrail"><span>{String(i+1).padStart(2,'0')}</span><div></div></div><div className="daybody"><div className="dayhead"><div><b>{d.date}</b><h3>{d.title}</h3></div>{i===2&&<span className="tag">~40 km loop</span>}</div><ul>{d.items.map((x,j)=><li key={j}>{x}</li>)}</ul>{i===2&&<div className="routebox">Terra → Table Land → Parsi Point → Strawberry Farm → Mapro → Lunch → Venna Lake → Terra</div>}</div></div>)}</div></section>}
function Checklist({checks,toggle,query,setQuery,progress,done,total}){const groups={};baseChecklist.filter(x=>(x.text+' '+x.cat).toLowerCase().includes(query.toLowerCase())).forEach(x=>(groups[x.cat]??=[]).push(x));return <section><div className="sectiontitle"><div><p className="eyebrow">PACK SMART</p><h2>Master checklist</h2><p className="muted">{done} of {total} completed</p></div><div className="progress"><div><span style={{width:progress+'%'}}></span></div><b>{progress}%</b></div></div><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search checklist…"/>{query&&<button onClick={()=>setQuery('')}><X size={16}/></button>}</div><div className="checkgrid">{Object.entries(groups).map(([cat,items])=><div className="card checklistcard" key={cat}><h3>{cat}</h3>{items.map(x=><label className={checks[x.id]?'check done':''} key={x.id}><input type="checkbox" checked={!!checks[x.id]} onChange={()=>toggle(x.id)}/><span>{x.text}</span></label>)}</div>)}</div></section>}
function Budget({trip,expenses,spent,remaining,showAdd,setShowAdd,addExpense,setExpenses}){return <section><div className="sectiontitle"><div><p className="eyebrow">MONEY</p><h2>Trip budget</h2><p className="muted">Target budget ₹{trip.budget.toLocaleString('en-IN')}</p></div><button onClick={()=>setShowAdd(true)}><Plus size={17}/> Add expense</button></div><div className="budgethero"><div><small>Spent</small><strong>₹{spent.toLocaleString('en-IN')}</strong></div><div><small>Remaining</small><strong>₹{Math.max(0,remaining).toLocaleString('en-IN')}</strong></div><div><small>Budget</small><strong>₹{trip.budget.toLocaleString('en-IN')}</strong></div></div>{showAdd&&<form className="addform" onSubmit={addExpense}><input name="name" placeholder="Expense" required/><input name="amount" type="number" min="0" placeholder="Amount" required/><select name="cat"><option>Hotel</option><option>Fuel</option><option>Food</option><option>Tolls</option><option>Activities</option><option>Shopping</option><option>Other</option></select><button>Add</button><button type="button" className="secondary" onClick={()=>setShowAdd(false)}>Cancel</button></form>}<div className="card"><h3>Expenses</h3>{expenses.length===0?<p className="muted">No actual expenses added yet.</p>:expenses.map(e=><div className="expense" key={e.id}><span>{e.name}<small>{e.cat}</small></span><b>₹{Number(e.amount).toLocaleString('en-IN')}</b><button className="danger" onClick={()=>setExpenses(v=>v.filter(x=>x.id!==e.id))}><Trash2 size={15}/></button></div>)}</div></section>}
function Stays({hotels}){return <section><div className="sectiontitle"><div><p className="eyebrow">BOOKINGS</p><h2>Hotels</h2></div></div><div className="staygrid">{hotels.map(h=><div className="card stay" key={h.name}><div className="hotelhero"><Hotel size={25}/></div><p className="eyebrow">{h.date}</p><h3>{h.name}</h3><p className="muted">{h.note}</p><div className="hotelactions"><a href="https://www.google.com/maps/search/?api=1&query=Hotel+Pratham+Solapur" target="_blank">Maps <ExternalLink size={14}/></a><a href="https://terralife.co/" target="_blank">Website <ExternalLink size={14}/></a></div></div>)}</div></section>}
function Essentials(){return <section><div className="sectiontitle"><div><p className="eyebrow">QUICK REFERENCE</p><h2>Trip essentials</h2></div></div><div className="essentialgrid"><Info icon={Car} title="Car before departure" text="Fuel, tyre pressure, spare tyre, inflator, FASTag, RC, insurance and PUC."/><Info icon={Baby} title="Baby cabin bag" text="Keep diapers, wipes, one full change, feeding supplies and comfort items within reach."/><Info icon={CloudSun} title="Hill weather" text="Carry a light warm layer and rain protection. October weather can change quickly in the hills."/><Info icon={Wallet} title="Cash" text="Keep roughly ₹5,000–₹7,000 emergency cash; use cards/UPI for normal spending."/><Info icon={AlertTriangle} title="Driving" text="Avoid late-night ghat driving and take baby breaks roughly every 2–2.5 hours."/><Info icon={FileText} title="Documents" text="Keep hotel confirmations, driving licence, RC, insurance, PUC and IDs accessible."/></div></section>}
function Info({icon:Icon,title,text}){return <div className="card info"><Icon size={22}/><h3>{title}</h3><p className="muted">{text}</p></div>}

createRoot(document.getElementById('root')).render(<App/>);
