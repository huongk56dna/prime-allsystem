import {languagePicker,startLocalization,translateText} from './i18n.js?v=25';
startLocalization();
// Test-only browser gate. Not a server authentication boundary.
const KEY='prime-review-test-session-v1';
const HASH='3210e173273245f0c8eca130e76487f1fd401c9c81cfbc395f9ee0e66e766034';
const duration=8*60*60*1000;
function valid(){try{const v=JSON.parse(sessionStorage.getItem(KEY));return v?.user==='cmc-test 01'&&Number.isFinite(v.expires)&&v.expires>Date.now()&&v.expires<=Date.now()+duration}catch{return false}}
function loginPage(){document.getElementById('root').innerHTML=`${languagePicker()}<main class="login-page"><section class="login-intro"><div class="brand"><span class="brand-mark">P</span>PRIME</div><div><p class="eyebrow">BUSINESS EXPERIENCE</p><h1>Một không gian.<br>Bốn trải nghiệm.</h1><p>Web quản trị, Customer App, Sales App và App Bảo vệ.<br>Kết nối kinh doanh, khách hàng và đội ngũ Sales.</p></div><small>PRIME BUSINESS SYSTEM</small></section><section class="login-form-wrap"><form id="login-form" class="login-card"><p class="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h2>Đăng nhập Prime</h2><p class="login-caption">Nhập tài khoản của bạn để tiếp tục.</p><label>Tên đăng nhập<input name="username" autocomplete="username" required placeholder="Nhập tên đăng nhập" autofocus maxlength="100"></label><label>Mật khẩu<div class="password-field"><input name="password" type="password" autocomplete="current-password" required placeholder="Nhập mật khẩu" maxlength="200"><button id="show-password" type="button" aria-label="Hiển thị mật khẩu">Hiện</button></div></label><p id="login-error" role="alert"></p><button type="submit" class="primary login-submit">Đăng nhập</button></form></section></main>`;
const form=document.getElementById('login-form');const error=document.getElementById('login-error');
document.getElementById('show-password').onclick=()=>{const input=form.elements.password;input.type=input.type==='password'?'text':'password';document.getElementById('show-password').textContent=input.type==='password'?'Hiện':'Ẩn'};
form.onsubmit=async e=>{e.preventDefault();error.textContent='';const submit=form.querySelector('[type=submit]');submit.disabled=true;try{const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(form.elements.password.value));const hash=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');if(form.elements.username.value.trim()!=='cmc-test 01'||hash!==HASH){error.textContent='Tên đăng nhập hoặc mật khẩu chưa đúng.';return}sessionStorage.setItem(KEY,JSON.stringify({user:'cmc-test 01',expires:Date.now()+duration}));location.reload()}catch{error.textContent='Không thể đăng nhập. Hãy mở bằng HTTPS hoặc localhost và cho phép lưu phiên.'}finally{submit.disabled=false}};
}
if(valid()){
await import('./app.js?v=25');
const logout=document.createElement('button');logout.textContent='Đăng xuất';logout.className='test-logout';logout.setAttribute('aria-label','Đăng xuất Prime');document.body.append(logout);logout.onclick=()=>{sessionStorage.removeItem(KEY);location.reload()};setInterval(()=>{if(!valid())location.reload()},60000);
}else loginPage();
