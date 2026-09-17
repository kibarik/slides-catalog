class WorkshopTimer extends HTMLElement {
  connectedCallback() {
    const initial=Number(this.getAttribute('minutes')||10);
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;font-family:Inter,Arial,sans-serif;color:#080808}*{box-sizing:border-box}.box{border:2px solid #080808;background:#ecebe6;padding:12px}.head{display:flex;align-items:center;justify-content:space-between;gap:8px}.label{font:800 12px/1 monospace;letter-spacing:.08em;text-transform:uppercase}.time{margin:12px 0 10px;font:850 42px/.95 "SFMono-Regular",Consolas,monospace;letter-spacing:-.05em}.controls{display:grid;grid-template-columns:1fr auto;gap:8px}select,button{border:2px solid #080808;background:#fff;color:#080808;font:750 13px/1 Arial;padding:8px}button{background:#3152e8;color:#fff;cursor:pointer}.box.warn{background:#ffd84d}.box.alert{background:#ff6b35;animation:pulse .7s infinite alternate}@keyframes pulse{to{box-shadow:0 0 0 7px rgba(255,107,53,.28)}}
    </style><div class="box"><div class="head"><span class="label">Таймер практикума</span><span aria-live="polite" class="state">готов</span></div><div class="time">${String(initial).padStart(2,'0')}:00</div><div class="controls"><select aria-label="Лимит времени"><option value="5">5 минут</option><option value="10">10 минут</option><option value="15">15 минут</option></select><button type="button">Запустить</button></div></div>`;
    const box=this.shadowRoot.querySelector('.box'),time=this.shadowRoot.querySelector('.time'),state=this.shadowRoot.querySelector('.state'),select=this.shadowRoot.querySelector('select'),button=this.shadowRoot.querySelector('button');
    select.value=String(initial);let left=initial*60,timer=null,running=false;
    const draw=()=>{time.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;box.classList.toggle('warn',left<=180&&left>60);box.classList.toggle('alert',left<=60&&left>0);state.textContent=left===0?'время':running?'идёт':'готов'};
    const stop=()=>{clearInterval(timer);timer=null;running=false;button.textContent=left===0?'Сбросить':'Продолжить';draw()};
    button.addEventListener('click',()=>{if(left===0){left=Number(select.value)*60;button.textContent='Запустить';draw();return}if(running){stop();return}running=true;button.textContent='Пауза';draw();timer=setInterval(()=>{left=Math.max(0,left-1);draw();if(left===0)stop()},1000)});
    select.addEventListener('change',()=>{clearInterval(timer);timer=null;running=false;left=Number(select.value)*60;button.textContent='Запустить';draw()});draw();
  }
}
customElements.define('workshop-timer',WorkshopTimer);
