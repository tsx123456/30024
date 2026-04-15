import{r as u,cU as g,U as p,n as b,h as e,bR as h}from"./index-fe013be6.js";function v(x){const c=u(!0),t={zh:{title:"提示",message:"网络已断开，是否重新连接？",cancel:"取消",confirm:"确定"},en:{title:"Notice",message:"Connection lost, reconnect?",cancel:"Cancel",confirm:"Confirm"},ru:{title:"Уведомление",message:"Соединение потеряно, переподключиться?",cancel:"Отмена",confirm:"ОК"},pt:{title:"Aviso",message:"Conexão perdida, reconectar?",cancel:"Cancelar",confirm:"Confirmar"},vn:{title:"Thông báo",message:"Mất kết nối mạng, kết nối lại?",cancel:"Hủy",confirm:"Đồng ý"}}[(()=>{const r=new URLSearchParams(window.location.search).get("lang");return["zh","en","ru","pt","vn"].includes(r)?r:"en"})()],d={setup(){const r=()=>{c.value=!1,a.unmount(),o.remove(),document.referrer&&document.referrer.length>0?window.history.back():location.reload()},f=()=>{c.value=!1,a.unmount(),o.remove(),h.Instance.continueRetry()},s=(n,l=20,m=12)=>{if(!n)return;let i=l;for(n.style.fontSize=i+"px";n.scrollWidth>n.clientWidth&&i>m;)i-=1,n.style.fontSize=i+"px"};return p(()=>{b(()=>{const n=document.getElementById("cancel-btn"),l=document.getElementById("confirm-btn");s(n),s(l)})}),()=>c.value?e("div",{style:`
                  position: fixed;
                  top:0; left:0;
                  width:100vw; height:100vh;
                  background: rgba(0,0,0,0.5);
                  display:flex;
                  justify-content:center;
                  align-items:center;
                  z-index:9999;
                `},[e("div",{style:`
                      background: rgba(0,0,0,0.85);
                      padding: 30px 40px;
                      border-radius: 12px;
                      width:400px;
                      max-width:90vw;
                      text-align:center;
                      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                      color: #f0f0f0;
                      font-family: 'Segoe UI', sans-serif;
                    `},[e("h3",{style:"margin-bottom:15px; font-size:26px;"},t.title),e("p",{style:"margin-bottom:30px;font-size:18px;line-height:1.6;"},t.message),e("div",{style:"display:flex; justify-content:space-between; gap:10px;"},[e("button",{id:"cancel-btn",style:"flex:1;height:50px;border:none;border-radius:6px;background:#28a745;color:#fff;font-weight:bold;cursor:pointer;",onClick:r},t.cancel),e("button",{id:"confirm-btn",style:"flex:1;height:50px;border:none;border-radius:6px;background:#dc3545;color:#fff;font-weight:bold;cursor:pointer;",onClick:f},t.confirm)])])]):null}},o=document.createElement("div");document.body.appendChild(o);const a=g(d);a.mount(o)}export{v as showReconnectDialog};
