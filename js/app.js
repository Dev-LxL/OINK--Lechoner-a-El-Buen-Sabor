'use strict';
const cart = new Map();
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-menu');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const summaryButton = document.querySelector('#summary-btn');
const summaryOutput = document.querySelector('#summary-output');
const summaryText = document.querySelector('#summary-text');
const toast = document.querySelector('#toast');
let toastTimeout;
function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400); }
menuToggle.addEventListener('click', () => { const expanded = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!expanded)); menuToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú'); nav.classList.toggle('open', !expanded); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menú'); }));
function renderCart() {
  const total = [...cart.values()].reduce((a,b) => a+b,0);
  cartCount.textContent = String(total);
  cartItems.replaceChildren();
  if (!total) { const p=document.createElement('p');p.className='empty-cart';p.textContent='Tu antojo comienza en el menú. Agrega un producto de referencia para verlo aquí.';cartItems.append(p); }
  for (const [product,quantity] of cart) {
    const row = document.createElement('div');row.className='cart-item';
    const info = document.createElement('div');const title=document.createElement('b');title.textContent=product;const note=document.createElement('small');note.textContent='Producto de demostración · Por confirmar';info.append(title,note);
    const controls=document.createElement('div');controls.className='quantity';
    const minus=document.createElement('button');minus.type='button';minus.setAttribute('aria-label','Quitar una unidad de '+product);minus.textContent='−';minus.addEventListener('click',()=>changeQuantity(product,-1));
    const number=document.createElement('span');number.textContent=String(quantity);
    const plus=document.createElement('button');plus.type='button';plus.setAttribute('aria-label','Agregar una unidad de '+product);plus.textContent='+';plus.addEventListener('click',()=>changeQuantity(product,1));
    controls.append(minus,number,plus);row.append(info,controls);cartItems.append(row);
  }
  summaryButton.disabled = total === 0;
  summaryOutput.hidden = true;
}
function changeQuantity(product,delta){ const next=Math.max(0,Math.min(99,(cart.get(product)||0)+delta));if(next)cart.set(product,next);else cart.delete(product);renderCart(); }
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => { changeQuantity(button.dataset.product,1); notify('Añadido a la consulta de demostración'); }));
document.querySelector('#clear-cart').addEventListener('click', () => { cart.clear();renderCart();notify('Consulta vaciada'); });
summaryButton.addEventListener('click', () => { if(!cart.size)return;const lines=['Hola, me gustaría consultar disponibilidad y precios de estos productos de referencia:','',...[...cart].map(([name,q])=>`• ${name}: ${q} unidad(es)`),'','Por favor, confirmen qué presentaciones ofrecen y sus precios.'];summaryText.value=lines.join('\n');summaryOutput.hidden=false;summaryText.focus(); });
document.querySelector('#copy-summary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summaryText.value);notify('Mensaje copiado. No se ha enviado ningún pedido.');}catch{summaryText.select();notify('Selecciona y copia el texto. No se ha enviado ningún pedido.');}});
renderCart();
