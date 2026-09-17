class WorkshopPoll extends HTMLElement {
  connectedCallback(){
    const key=`workshop-poll:${this.getAttribute('guide')||'default'}`,presenter=this.getAttribute('mode')==='presenter';
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;font-family:Inter,Arial,sans-serif;color:#080808}*{box-sizing:border-box}.box{border:2px solid #080808;background:#fff;padding:14px}.title{font:800 12px/1 monospace;letter-spacing:.07em;text-transform:uppercase}.bars{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}button{min-height:62px;border:2px solid #080808;background:#ecebe6;font:750 12px/1.12 Arial;cursor:pointer;padding:8px 4px}button[data-vote="done"]{border-bottom:8px solid #159657}button[data-vote="question"]{border-bottom:8px solid #858585}button[data-vote="problem"]{border-bottom:8px solid #e14b3b}.count{display:block;margin-top:7px;font:850 23px/1 monospace}.log-title{margin:20px 0 8px;padding-top:16px;border-top:2px solid #080808;font:800 12px/1 monospace;text-transform:uppercase}.events{margin:0;padding:0;list-style:none;max-height:310px;overflow:auto}.events li{display:grid;grid-template-columns:48px 1fr;gap:10px;padding:10px 0;border-top:1px solid #aaa;font-size:13px;line-height:1.25}.events time{font:700 11px/1.2 monospace;color:#64645f}.empty{padding:14px 0;color:#64645f;font-size:13px}.note{margin:10px 0 0;color:#64645f;font:11px/1.25 Arial}
    </style><div class="box"><div class="title">Голосование</div><div class="bars"><button data-vote="done">Я сделал<span class="count">0</span></button><button data-vote="question">Есть вопрос<span class="count">0</span></button><button data-vote="problem">Есть проблема<span class="count">0</span></button></div>${presenter?'<div class="log-title">События участников</div><ul class="events"></ul>':''}<p class="note">${presenter?'Локальный прототип. Общий realtime-лог появится после подключения backend.':'Ответ сохраняется на этом устройстве.'}</p></div>`;
    let saved;
    try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch{saved={}}
    saved={done:Number(saved.done)||0,question:Number(saved.question)||0,problem:Number(saved.problem)||0,events:Array.isArray(saved.events)?saved.events:[]};
    const labels={done:'успех',question:'вопрос',problem:'проблема'};
    const draw=()=>{
      this.shadowRoot.querySelectorAll('button').forEach(b=>b.querySelector('.count').textContent=saved[b.dataset.vote]);
      const events=this.shadowRoot.querySelector('.events');if(events)events.innerHTML=saved.events.length?saved.events.slice(-12).reverse().map(item=>`<li><time>${item.time}</time><span>Участник отметил: <strong>${labels[item.vote]}</strong></span></li>`).join(''):'<li class="empty">Пока нет событий</li>';
      this.dispatchEvent(new CustomEvent('poll-change',{bubbles:true,composed:true,detail:{done:saved.done,question:saved.question,problem:saved.problem}}));
    };
    this.shadowRoot.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const vote=b.dataset.vote;saved[vote]+=1;saved.events.push({vote,time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})});saved.events=saved.events.slice(-30);localStorage.setItem(key,JSON.stringify(saved));draw()});draw();setTimeout(draw,0);
  }
}
customElements.define('workshop-poll',WorkshopPoll);
