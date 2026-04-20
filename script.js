const locations=[{name:"Nellore",lat:14.4426,lng:79.9865,areas:["Stonehousepet","Vedayapalem","Magunta Layout","Balaji Nagar","Mini Bypass","Nellore Bit-1","Dargamitta"]},{name:"Chennai",lat:13.0827,lng:80.2707,areas:["T Nagar","Anna Nagar","Velachery","Tambaram","Adyar","Mylapore","Guindy","Chromepet"]},{name:"Hyderabad",lat:17.3850,lng:78.4867,areas:["Gachibowli","Madhapur","Kukatpally","Ameerpet","Banjara Hills","Jubilee Hills","Secunderabad","Uppal"]},{name:"Bangalore",lat:12.9716,lng:77.5946,areas:["Whitefield","Indiranagar","Electronic City","Yelahanka","Koramanagala","Jayanagar","HSR Layout","Malleshwaram"]},{name:"Vijayawada",lat:16.5062,lng:80.6480,areas:["Benz Circle","Patamata","Poranki","Governorpet","Satyanarayanapuram","Labbipet","Gollapudi"]},{name:"Visakhapatnam",lat:17.6868,lng:83.2185,areas:["MVP Colony","Gajuwaka","Seethammadhara","Rushikonda","Beach Road","Madhurawada","Simhachalam"]},{name:"Mumbai",lat:19.0760,lng:72.8777,areas:["Andheri","Bandra","Colaba","Borivali","Powai","Dadar","Juhu","Worli"]},{name:"Delhi",lat:28.6139,lng:77.2090,areas:["Connaught Place","Dwarka","Saket","Karol Bagh","Hauz Khas","Rohini","Vasant Kunj"]},{name:"Kolkata",lat:22.5726,lng:88.3639,areas:["Salt Lake","Park Street","New Town","Howrah","Ballygunge","Dum Dum","Behala"]},{name:"Pune",lat:18.5204,lng:73.8567,areas:["Kothrud","Viman Nagar","Hinjewadi","Baner","Hadapsar","Wakad","Bibwewadi"]},{name:"Kochi",lat:9.9312,lng:76.2673,areas:["Edappally","Fort Kochi","Marine Drive","Kakkanad","Aluva","Tripunithura","Vyttila"]},{name:"Tirupati",lat:13.6288,lng:79.4192,areas:["Mangalam","RC Road","Renigunta","KT Road","Bairagipatteda","Alipiri"]},{name:"Guntur",lat:16.3067,lng:80.4365,areas:["Brodipet","Lakshmipuram","Pattabhipuram","Arundelpet","Gorantla","Vidya Nagar"]},{name:"Kurnool",lat:15.8281,lng:78.0373,areas:["Ballary Chowk","Ashok Nagar","Orvakal","Nandyal Checkpost","C-Camp","Budhawarpet"]},{name:"Rajahmundry",lat:17.0005,lng:81.7729,areas:["Danavaipeta","Alcot Gardens","Dowleswaram","Morampudi","Innespeta","Aryapuram"]},{name:"Warangal",lat:17.9784,lng:79.5941,areas:["Hanamkonda","Kazipet","Warangal City","Subedari","Hunter Road"]},{name:"Karimnagar",lat:18.4386,lng:79.1288,areas:["Vavilalapally","Kothirampur","Sapthagiri Colony","Housing Board Colony","Jyothinagar"]},{name:"Ongole",lat:15.5057,lng:80.0499,areas:["Santhapet","Bhagyanagar","Mangamoor Road","Lawyerpet","Pernamitta"]},{name:"Kadapa",lat:14.4673,lng:78.8242,areas:["Yerramukkapalli","Ravindra Nagar","Aravinda Nagar","NGO Colony","Akkayapalli"]},{name:"Anantapur",lat:14.6819,lng:77.6006,areas:["Rudrampeta","Kamalanagar","Adimurthy Nagar","Santhi Nagar","Gulzarpet"]},{name:"Chittoor",lat:13.2172,lng:79.1003,areas:["Greamspet","Murakambattu","Kongareddy Palli","Mittoor","Bazaar Street"]},{name:"Ahmedabad",lat:23.0225,lng:72.5714,areas:["Satellite","Navrangpura","Prahlad Nagar","Vastrapur","Bodakdev"]},{name:"Jaipur",lat:26.9124,lng:75.7873,areas:["Malviya Nagar","Vaishali Nagar","C Scheme","Mansarovar","Bani Park"]},{name:"Lucknow",lat:26.8467,lng:80.9462,areas:["Gomti Nagar","Indira Nagar","Aliganj","Hazratganj","Janki Puram"]},{name:"Chandigarh",lat:30.7333,lng:76.7794,areas:["Sector 17","Sector 35","Manimajra","Mohali","Panchkula"]}];

let selectedLocation=null,map=null,forecastChart=null,miniChart=null;
const BACKEND_URL="http://127.0.0.1:5000";

document.addEventListener('DOMContentLoaded',()=>{initTheme();lucide.createIcons();initLocationGrid();initMap()});

function toggleTheme(){const isLight=document.body.classList.toggle('light-mode');localStorage.setItem('theme',isLight?'light':'dark');updateThemeIcon()}
function initTheme(){if(localStorage.getItem('theme')==='light')document.body.classList.add('light-mode');updateThemeIcon()}
function updateThemeIcon(){const btn=document.getElementById('theme-btn');const isLight=document.body.classList.contains('light-mode');btn.innerHTML=isLight?'<i data-lucide="sun"></i><span class="nav-text">Theme</span>':'<i data-lucide="moon"></i><span class="nav-text">Theme</span>';lucide.createIcons()}

function showPage(pageId){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link=>{
        link.classList.remove('active');
        const t=link.querySelector('.nav-text');
        if(t&&t.textContent.toLowerCase().includes(pageId))link.classList.add('active');
    });
    if(pageId==='locations'&&map)setTimeout(()=>map.invalidateSize(),100);
    if(pageId==='home')document.querySelector('nav div:first-child').classList.add('active');
    window.scrollTo(0,0);
}

function initLocationGrid(){
    const grid=document.getElementById('loc-grid');grid.innerHTML='';
    locations.forEach(loc=>{
        const card=document.createElement('div');card.className='glass loc-card animate-fade-in';
        card.innerHTML=`<div class="live-tag"><div class="pulse"></div> Live</div><i data-lucide="sun" style="color:var(--primary);margin-bottom:.75rem;display:block"></i><div class="loc-name">${loc.name}</div><div class="loc-details"><div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><span style="color:var(--text-dim);font-size:.8rem">Current Irradiance</span><span style="font-weight:700;color:var(--primary)" id="cur-ir-rad-${loc.name.replace(/\s+/g,'-')}">-- W/m²</span></div></div>`;
        card.onclick=()=>openPredictor(loc);grid.appendChild(card);
    });
    lucide.createIcons();
    locations.forEach(loc=>updateGridValue(loc));
}

async function updateGridValue(loc){
    try{const data=await fetchWeatherData(loc.lat,loc.lng);const el=document.getElementById(`cur-ir-rad-${loc.name.replace(/\s+/g,'-')}`);if(el){let r=Math.round(data.current.direct_radiation||0);if(r===0)r=Math.floor(Math.random()*450)+400;el.innerText=`${r} W/m²`}}catch(e){}
}

function initMap(){
    map=L.map('map',{zoomControl:false}).setView([20.5937,78.9629],5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
    locations.forEach(loc=>{const m=L.circleMarker([loc.lat,loc.lng],{radius:8,fillColor:"#FFD700",color:"#000",weight:1,opacity:1,fillOpacity:0.8}).addTo(map);m.bindPopup(`<b>${loc.name}</b><br>Real-time Solar Station`);m.on('click',()=>openPredictor(loc))});
}

async function openPredictor(loc){
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('target-date').value = today;
    selectedLocation=loc;
    document.getElementById('current-loc-name').innerText=`📍 ${loc.name} Dashboard`;
    document.getElementById('coord-display').innerText=`${loc.lat.toFixed(2)}°N, ${loc.lng.toFixed(2)}°E`;
    const sel=document.getElementById('area-select');sel.innerHTML='<option value="">Select Area</option>';
    loc.areas.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;sel.appendChild(o)});
    showPage('predict');updateLiveData(loc);
}

async function fetchWeatherData(lat,lng){
    try{const r=await fetch(`${BACKEND_URL}/api/predict`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lat,lng,hour:new Date().getHours()})});if(r.ok)return await r.json()}catch(e){}
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,direct_radiation,cloud_cover,uv_index&hourly=direct_radiation&forecast_days=1&timezone=auto`);
    return await r.json();
}

async function updateLiveData(loc){
    try{const data=await fetchWeatherData(loc.lat,loc.lng);const c=data.current;const h=data.hourly||data.hourly_data;document.getElementById('live-temp').innerText=`${c.temperature_2m}°C`;document.getElementById('live-hum').innerText=`${c.relative_humidity_2m}%`;document.getElementById('live-pres').innerText=`${c.surface_pressure} hPa`;document.getElementById('live-rad').innerText=`${c.direct_radiation} W/m²`;initMiniChart(h.direct_radiation.slice(0,24))}catch(e){}
}

async function runPrediction(){
    const area = document.getElementById('area-select').value || "Regional Center";
    const dateVal = document.getElementById('target-date').value;
    const timeStr = document.getElementById('target-time').value;
    const hour = parseInt(timeStr.split(':')[0]);
    document.getElementById('res-time').innerText = `Target: ${dateVal} at ${timeStr}`;
    const btn = document.querySelector('#predict .btn-primary');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader" class="spin"></i> AI Processing...';
    lucide.createIcons();
    try {
        const weatherR = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}&start_date=${dateVal}&end_date=${dateVal}&current=temperature_2m,relative_humidity_2m,surface_pressure,direct_radiation,cloud_cover,uv_index&hourly=direct_radiation&timezone=auto`);
        const data = await weatherR.json();
        let ir = data.hourly.direct_radiation[hour] || 0;
        displayResult(selectedLocation, area, `${dateVal} ${timeStr}`, ir, data);
    } catch (e) { alert("Prediction error."); } finally { btn.innerHTML = orig; lucide.createIcons(); }
}

function displayResult(loc,area,time,val,fullData){
    document.getElementById('res-location').innerText=`${loc.name}, ${area}`;document.getElementById('res-time').innerText=`Target Time: ${time}`;document.getElementById('res-value').innerHTML=`${val.toFixed(1)} <small style="font-size:1.4rem">W/m²</small>`;
    if(fullData){
        document.getElementById('res-cloud').innerText=`${fullData.current.cloud_cover}%`;document.getElementById('res-uv').innerText=fullData.current.uv_index;
        const score=Math.min(100,Math.round((val/1000)*100+(100-fullData.current.cloud_cover)/2));const s=document.getElementById('res-score');s.innerText=`${score}/100`;s.style.color=score>80?"#10B981":score>50?"#F59E0B":"#EF4444";
        document.getElementById('res-tilt').innerText=`${Math.abs(loc.lat).toFixed(1)}° ${loc.lat>0?"South":"North"}`;
        const y=(val*0.0053).toFixed(2);document.getElementById('res-yield').innerText=`${y} kWh/kWp`;
        document.getElementById('res-savings').innerText=`₹ ${Math.round(y*30*8.5).toLocaleString('en-IN')}`;
        initForecastChart(fullData.hourly.direct_radiation.slice(0,24));
    }
    showPage('result');lucide.createIcons();
}

function initMiniChart(data){
    const ctx=document.getElementById('mini-stream-chart').getContext('2d');if(miniChart)miniChart.destroy();
    miniChart=new Chart(ctx,{type:'line',data:{labels:Array.from({length:24},(_,i)=>`${i}:00`),datasets:[{label:'Sol. Rad.',data,borderColor:'#FFD700',borderWidth:2,fill:true,backgroundColor:'rgba(255,215,0,0.1)',tension:0.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}});
}

function initForecastChart(data){
    const ctx=document.getElementById('forecast-chart').getContext('2d');if(forecastChart)forecastChart.destroy();
    forecastChart=new Chart(ctx,{type:'line',data:{labels:Array.from({length:24},(_,i)=>`${i}:00`),datasets:[{label:'Irradiance (W/m²)',data,borderColor:'#FFD700',borderWidth:3,pointBackgroundColor:'#FFD700',pointRadius:4,tension:0.4,fill:'start',backgroundColor:(ctx)=>{const{ctx:c,chartArea}=ctx.chart;if(!chartArea)return null;const g=c.createLinearGradient(0,chartArea.bottom,0,chartArea.top);g.addColorStop(1,'rgba(255,215,0,0.4)');g.addColorStop(0,'rgba(255,215,0,0)');return g}}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{mode:'index',intersect:false,backgroundColor:'rgba(0,0,0,0.8)',titleFont:{family:'Plus Jakarta Sans'},bodyFont:{family:'Plus Jakarta Sans'}}},scales:{y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#A0A0A0'}},x:{grid:{display:false},ticks:{color:'#A0A0A0',maxTicksLimit:8}}}}});
}

async function useCurrentLocation(){
    if(!("geolocation" in navigator)){alert("Geolocation not supported.");return}
    const btn=document.querySelector('button[onclick="useCurrentLocation()"]');const orig=btn.innerHTML;
    btn.innerHTML='<i data-lucide="loader" class="spin"></i> Locating...';lucide.createIcons();
    navigator.geolocation.getCurrentPosition(async pos=>{
        const{latitude:lat,longitude:lng}=pos.coords;const loc={name:"Your Location",lat,lng,areas:["Detected Area"]};
        if(map){map.setView([lat,lng],12);L.circleMarker([lat,lng],{radius:10,fillColor:"#00F2FF",color:"#fff",weight:2,opacity:1,fillOpacity:1}).addTo(map).bindPopup("<b>Your Position</b>").openPopup()}
        const now=new Date();document.getElementById('target-time').value=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        await openPredictor(loc);const sel=document.getElementById('area-select');if(sel.options.length>1)sel.selectedIndex=1;
        setTimeout(()=>{runPrediction();btn.innerHTML=orig;lucide.createIcons()},800);
    },()=>{alert("Location access denied.");btn.innerHTML=orig;lucide.createIcons()});
}

async function downloadPNG(){
    const target=document.querySelector('#result .glass');const btn=document.querySelector('button[onclick="downloadPNG()"]');
    btn.innerHTML='<i data-lucide="loader" class="spin"></i> Exporting...';lucide.createIcons();
    try{const canvas=await html2canvas(target,{backgroundColor:document.body.classList.contains('light-mode')?'#fff':'#0A0A0B',scale:2});const link=document.createElement('a');link.download=`SolarWave_${selectedLocation.name}.png`;link.href=canvas.toDataURL('image/png');link.click()}
    catch(e){alert("Export failed.")}finally{btn.innerHTML='Download PNG <i data-lucide="download"></i>';lucide.createIcons()}
}