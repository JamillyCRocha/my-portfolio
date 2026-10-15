(() => {
  const section = document.querySelector('#software-architecture');
  if (!section || section.dataset.initialized) return;
  section.dataset.initialized = 'true';
  const stage = section.querySelector('.devflow__pipeline');
  const cards = [...section.querySelectorAll('.devflow__card')];
  const svg = section.querySelector('.devflow__paths');
  const logs = section.querySelector('.devflow__logs');
  const replay = section.querySelector('.devflow__replay');
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = [
    ['CLIENT','Preparing interface...',0],
    ['API','POST /api/projects — authenticating...',1],
    ['SERVER','Processing business rules...',2],
    ['DATABASE','Running SQL query...',3],
    ['DATABASE','Data fetched successfully.',3],
    ['SERVER','Serializing JSON response...',2],
    ['API','HTTP 200 OK — returning payload.',1],
    ['CLIENT','UI updated successfully ✓',0]
  ];
  let timer = null, index = 0, selected = -1, visible = true;
  function activate(i){cards.forEach((card,n)=>card.classList.toggle('is-active',n===i));}
  function line(x1,y1,x2,y2,color){
    const el=document.createElementNS(NS,'line');
    for(const [k,v] of Object.entries({x1,y1,x2,y2,stroke:color,'stroke-width':'2'}))el.setAttribute(k,String(v));
    return el;
  }
  function redraw(){
    const rect=stage.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
    const lines=svg.querySelector('.devflow__lines');
    const dots=svg.querySelector('.devflow__dots');
    lines.replaceChildren();dots.replaceChildren();
    for(let i=0;i<cards.length-1;i++){
      const a=cards[i].getBoundingClientRect(),b=cards[i+1].getBoundingClientRect();
      const sameRow=Math.abs(a.top-b.top)<30;
      const x1=(sameRow?a.right:a.left+a.width/2)-rect.left;
      const y1=(sameRow?a.top+a.height/2:a.bottom)-rect.top;
      const x2=(sameRow?b.left:b.left+b.width/2)-rect.left;
      const y2=(sameRow?b.top+b.height/2:b.top)-rect.top;
      const path=line(x1,y1,x2,y2,i%2?'#8a66ff':'#35d9fa');lines.append(path);
      if(!reduced){
        const dot=document.createElementNS(NS,'circle');dot.setAttribute('r','4');dot.setAttribute('fill','#64ebff');
        const animation=document.createElementNS(NS,'animateMotion');
        animation.setAttribute('dur','1.3s');animation.setAttribute('repeatCount','indefinite');
        animation.setAttribute('path',`M ${x1} ${y1} L ${x2} ${y2}`);
        dot.append(animation);dots.append(dot);
      }
    }
  }
  function tick(){
    const [source,message,active]=steps[index];
    if(selected===-1)activate(active);
    const row=document.createElement('div');
    const code=document.createElement('b');code.textContent=`[${source}] `;
    row.append(code,document.createTextNode(message));logs.append(row);
    while(logs.children.length>5)logs.firstElementChild.remove();
    index=(index+1)%steps.length;
  }
  function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
  function start(reset=false){stop();if(reset){index=0;logs.replaceChildren();}tick();if(!reduced)timer=setInterval(tick,1400);}
  cards.forEach((card,i)=>{
    card.addEventListener('mouseenter',()=>{selected=i;activate(i);});
    card.addEventListener('mouseleave',()=>{selected=-1;});
    card.addEventListener('focus',()=>{selected=i;activate(i);});
    card.addEventListener('blur',()=>{selected=-1;});
  });
  replay.addEventListener('click',()=>start(true));
  if('ResizeObserver' in window)new ResizeObserver(redraw).observe(stage);
  else window.addEventListener('resize',redraw);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();},{threshold:0.1}).observe(section);
  }else start();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(visible)start();});
  requestAnimationFrame(redraw);
})();
