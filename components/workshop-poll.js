class WorkshopPoll extends HTMLElement {
  connectedCallback(){
    const key=`workshop-poll:${this.getAttribute('guide')||'default'}`;
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML=`<style>:host{display:block;font-family:Inter,Arial,sans-serif;color:#080808}*{box-sizing:border-box}.box{border:2px solid #080808;background:#fff;padding:11px}.title{font:800 12px/1 monospace;letter-spacing:.07em;text-transform:uppercase}.bars{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}button{min-height:48px;border:2px solid #080808;background:#ecebe6;font:750 12px/1.12 Arial;cursor:pointer}button:first-child{border-bottom:7px solid #3152e8}button:last-child{border-bottom:7px solid #ff6b35}.count{display:block;margin-top:5px;font:850 18px/1 monospace}.note{margin:8px 0 0;color:#64645f;font:11px/1.2 Arial}</style><div class="box"><div class="title">Голосование</div><div class="bars"><button data-vote="done">Я сделал<span class="count">0</span></button><button data-vote="problem">Есть проблема<span class="count">0</span></button></div><p class="note">Визуальный прототип. Общий realtime-счётчик появится после backend.</p></div>`;
    const saved=JSON.parse(localStorage.getItem(key)||'{"done":0,"problem":0}');
    const draw=()=>this.shadowRoot.querySelectorAll('button').forEach(b=>b.querySelector('.count').textContent=saved[b.dataset.vote]||0);draw();
    this.shadowRoot.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;saved[b.dataset.vote]=(saved[b.dataset.vote]||0)+1;localStorage.setItem(key,JSON.stringify(saved));draw()});
  }
}
customElements.define('workshop-poll',WorkshopPoll);
