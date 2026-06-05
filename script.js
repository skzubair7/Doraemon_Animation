
// LOADER
window.addEventListener('load',()=>{
  setTimeout(()=>{document.getElementById('loader').classList.add('hide');},1800);
});

// FLOWER PETALS
var PETALS=['🌸','🌺','🌼','💐','🌹','✿','🏵️'];
function launchFlowers(count,duration){
  var container=document.getElementById('flower-rain');
  for(var i=0;i<count;i++){
    (function(delay){
      setTimeout(function(){
        var p=document.createElement('div');
        p.className='petal';
        p.textContent=PETALS[Math.floor(Math.random()*PETALS.length)];
        p.style.left=Math.random()*100+'vw';
        p.style.fontSize=(16+Math.random()*14)+'px';
        var dur=(duration||2)+Math.random()*2;
        p.style.animationDuration=dur+'s';
        p.style.animationDelay='0s';
        container.appendChild(p);
        setTimeout(function(){p.remove();},dur*1000+200);
      },delay);
    })(i*(duration?(duration*1000/count):40));
  }
}

// CELEBRATION SPARKS
var SPARK_COLORS=['#c9a84c','#e8c97a','#ff6b9d','#ff9f43','#48dbfb','#ff6b6b','#a29bfe'];
function launchCelebration(){
  var container=document.getElementById('celebration');
  var cx=window.innerWidth/2, cy=window.innerHeight/2;
  for(var i=0;i<80;i++){
    (function(i){
      setTimeout(function(){
        var s=document.createElement('div');
        s.className='spark';
        var angle=Math.random()*360;
        var dist=100+Math.random()*300;
        var tx=Math.cos(angle*Math.PI/180)*dist+'px';
        var ty=Math.sin(angle*Math.PI/180)*dist+'px';
        s.style.cssText='left:'+cx+'px;top:'+cy+'px;background:'+SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)]+
          ';width:'+(4+Math.random()*6)+'px;height:'+(4+Math.random()*6)+'px;--tx:'+tx+';--ty:'+ty+
          ';animation-duration:'+(0.6+Math.random()*0.8)+'s;animation-delay:0s;';
        container.appendChild(s);
        setTimeout(function(){s.remove();},(1.5+Math.random())*1000);
      },i*20);
    })(i);
  }
}

// DOOR OPEN
var doorsOpened=false;
function openDoors(){
  
  if(doorsOpened)return;
  doorsOpened=true;
  document.getElementById('doorL').classList.add('open');
  document.getElementById('doorR').classList.add('open');
  document.getElementById('door-behind').classList.add('visible');
  
   var audio = document.getElementById('bg-music');
  audio.play().then(() => { snd = true; document.getElementById('sound-btn').textContent = '🔊'; }).catch(e => console.log("Autoplay blocked"));

  launchFlowers(40,3);
  setTimeout(function(){
    var ds=document.getElementById('door-screen');
    ds.style.transition='opacity 1s ease';
    ds.style.opacity='0';
    setTimeout(function(){
      ds.style.display='none';
      document.getElementById('main').style.display='block';
      document.getElementById('sound-btn').style.display='flex';
      initAll();
      launchFlowers(60,4);
    },1000);
  },3000);
}
  
 
  
  
  

function initAll(){
  initCountdown();
  initSlider();
  initScratch();
  initFadeIn();
}

// COUNTDOWN — target June 11 2026 11:00 AM
function initCountdown(){
  function tick(){
    var target=new Date('2026-06-11T11:00:00+05:30');
    var now=new Date();
    var diff=target-now;
    if(diff<0)diff=0;
    var d=Math.floor(diff/86400000);
    var h=Math.floor((diff%86400000)/3600000);
    var m=Math.floor((diff%3600000)/60000);
    var s=Math.floor((diff%60000)/1000);
    document.getElementById('cd-d').textContent=String(d).padStart(2,'0');
    document.getElementById('cd-h').textContent=String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent=String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent=String(s).padStart(2,'0');
  }
  tick();setInterval(tick,1000);
}

// SLIDER
var slideIdx=0;
function initSlider(){setInterval(()=>{goSlide((slideIdx+1)%4);},3500);}
function goSlide(n){
  document.querySelectorAll('.slide').forEach((s,i)=>{s.classList.toggle('active',i===n);});
  document.querySelectorAll('.slide-dots span').forEach((d,i)=>{d.classList.toggle('active',i===n);});
  slideIdx=n;
}

// SCRATCH CARD with completion detection
function initScratch(){
  var canvas=document.getElementById('scratchCanvas');
  var wrap=canvas.parentElement;
  canvas.width=wrap.offsetWidth;
  canvas.height=wrap.offsetHeight;
  var ctx=canvas.getContext('2d');
  var grd=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  grd.addColorStop(0,'#b8922a');
  grd.addColorStop(0.5,'#d4a84b');
  grd.addColorStop(1,'#b8922a');
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // ornament text
  ctx.fillStyle='rgba(10,26,18,0.5)';
  ctx.font='bold 13px Cinzel, serif';
  ctx.textAlign='center';
  ctx.fillText('✦  Scratch to Reveal  ✦',canvas.width/2,canvas.height/2-8);
  ctx.font='10px Lato, sans-serif';
  ctx.fillText('Your Special Date',canvas.width/2,canvas.height/2+12);
  ctx.globalCompositeOperation='destination-out';
  var drawing=false;
  var totalPixels=canvas.width*canvas.height;
  var scratchedEnough=false;

  function getPos(e){
    var r=canvas.getBoundingClientRect();
    if(e.touches){return{x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top};}
    return{x:e.clientX-r.left,y:e.clientY-r.top};
  }
  function scratch(e){
    if(!drawing)return;
    var p=getPos(e);
    ctx.beginPath();ctx.arc(p.x,p.y,30,0,Math.PI*2);ctx.fill();
    e.preventDefault();
    if(!scratchedEnough)checkCompletion();
  }
  function checkCompletion(){
    var imgData=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
    var cleared=0;
    for(var i=3;i<imgData.data.length;i+=4){if(imgData.data[i]<128)cleared++;}
    if(cleared/totalPixels>0.55){
      scratchedEnough=true;
      onScratchComplete();
    }
  }
  function onScratchComplete(){
    // fade out canvas
    canvas.style.transition='opacity 0.8s ease';
    canvas.style.opacity='0';
    setTimeout(function(){canvas.style.display='none';},800);
    // flowers + celebration
    launchFlowers(80,5);
    launchCelebration();
    setTimeout(launchCelebration,600);
    setTimeout(function(){launchFlowers(50,4);},1000);
  }
  canvas.addEventListener('mousedown',()=>drawing=true);
  canvas.addEventListener('mouseup',()=>drawing=false);
  canvas.addEventListener('mousemove',scratch);
  canvas.addEventListener('touchstart',()=>drawing=true);
  canvas.addEventListener('touchend',()=>drawing=false);
  canvas.addEventListener('touchmove',scratch,{passive:false});
}

// FADE IN ON SCROLL
function initFadeIn(){
  var els=document.querySelectorAll('.fade-in');
  var obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
  },{threshold:0.15});
  els.forEach(el=>obs.observe(el));
}


function toggleSound(){
  var audio = document.getElementById('bg-music');
  if(!snd){
    audio.play();
    snd = true;
    document.getElementById('sound-btn').textContent = '🔊'; // Jab gana chalega to Volume icon dikhega
  } else {
    audio.pause();
    snd = false;
    document.getElementById('sound-btn').textContent = '🔇'; // Jam mute hoga to Mute icon dikhega
  }
}
