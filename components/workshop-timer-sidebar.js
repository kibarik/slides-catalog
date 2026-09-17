class WorkshopTimerSidebar extends HTMLElement {
  connectedCallback(){
    if(this.shadowRoot)return;
    const minutes=Number(this.getAttribute('minutes')||10);
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML=`<style>
      :host{position:absolute;right:18px;top:196px;z-index:70;display:block;width:0;height:0;font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:#080808}*{box-sizing:border-box}.tab{position:absolute;right:0;top:0;width:52px;height:156px;border:2px solid #080808;background:#3152e8;color:#fff;box-shadow:-5px 5px 0 rgba(8,8,8,.18);cursor:pointer;writing-mode:vertical-rl;transform:rotate(180deg);font:850 13px/1 monospace;letter-spacing:.04em}.tab.warn{background:#ffd84d;color:#080808}.tab.alert{background:#ff5b45;color:#080808;animation:pulse .7s infinite alternate}.tab.done{background:#080808;color:#fff}.panel{display:none;position:fixed;right:0;top:0;width:380px;height:720px;padding:70px 26px 28px;background:#ecebe6;border-left:3px solid #080808;box-shadow:-14px 0 0 rgba(8,8,8,.14)}.panel.open{display:block}.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:26px}.head strong{font:850 15px/1 monospace;letter-spacing:.08em;text-transform:uppercase}.close{width:42px;height:42px;border:2px solid #080808;background:#fff;font-size:26px;line-height:1;cursor:pointer}@keyframes pulse{to{box-shadow:-8px 8px 0 rgba(255,91,69,.38)}}
      @media(max-width:700px),(orientation:portrait) and (max-width:900px){:host{position:fixed;right:8px;top:170px}.tab{width:48px;height:142px}.panel{width:min(360px,96vw);height:100dvh;padding:62px 20px 24px}}
      @media print{:host{display:none}}
    </style><button class="tab" type="button" aria-expanded="false" aria-label="Открыть таймер">Таймер · <span class="value">${String(minutes).padStart(2,'0')}:00</span></button><aside class="panel" aria-label="Таймер"><div class="head"><strong>Таймер</strong><button class="close" type="button" aria-label="Закрыть">×</button></div><workshop-timer minutes="${minutes}"></workshop-timer></aside>`;
    const tab=this.shadowRoot.querySelector('.tab'),panel=this.shadowRoot.querySelector('.panel'),close=this.shadowRoot.querySelector('.close');
    const closePanel=()=>{const wasOpen=panel.classList.contains('open');panel.classList.remove('open');tab.hidden=false;tab.setAttribute('aria-expanded','false');if(wasOpen)window.dispatchEvent(new CustomEvent('workshop-sidebar-close'))};
    const openPanel=()=>{window.dispatchEvent(new CustomEvent('workshop-sidebar-open',{detail:{source:this}}));panel.classList.add('open');tab.hidden=true;tab.setAttribute('aria-expanded','true')};
    tab.addEventListener('click',openPanel);close.addEventListener('click',closePanel);window.addEventListener('workshop-sidebar-open',event=>{if(event.detail.source!==this){panel.classList.remove('open');tab.hidden=true;tab.setAttribute('aria-expanded','false')}});window.addEventListener('workshop-sidebar-close',()=>{if(!panel.classList.contains('open'))tab.hidden=false});
    this.addEventListener('timer-change',event=>{tab.querySelector('.value').textContent=event.detail.text;tab.classList.remove('warn','alert','done');if(event.detail.level!=='normal')tab.classList.add(event.detail.level)});
    this.open=openPanel;this.close=closePanel;
  }
}
customElements.define('workshop-timer-sidebar',WorkshopTimerSidebar);
