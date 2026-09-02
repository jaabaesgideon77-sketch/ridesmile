let selectedRating=0;
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='dashboard') renderDashboard();
}
function rate(n){
  selectedRating=n;
  document.querySelectorAll('#stars button').forEach((b,i)=>b.classList.toggle('selected',i<n));
}
function pick(btn){
  document.querySelectorAll('.choices button').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
}
function submitFeedback(){
  const issue=document.getElementById('issue').value.trim();
  const liked=document.getElementById('liked').value.trim();
  const id='#'+(1000+Number(localStorage.getItem('rideSmileCount')||0)+1);
  const item={id,rating:selectedRating||5,issue,liked,replied:true,reply:"Thank you so much! I'm glad you had a good experience. It means a lot! 😊"};
  const list=JSON.parse(localStorage.getItem('rideSmileFeedback')||'[]');
  list.unshift(item); localStorage.setItem('rideSmileFeedback',JSON.stringify(list));
  localStorage.setItem('rideSmileCount',String(list.length));
  document.getElementById('feedbackId').textContent=id;
  document.getElementById('viewId').textContent='ID: '+id;
  document.getElementById('viewStars').textContent='★'.repeat(item.rating)+'☆'.repeat(5-item.rating);
  document.getElementById('viewComment').textContent=liked||issue||'Thank you for sharing your experience.';
  selectedRating=0;
  document.getElementById('issue').value='';
  document.getElementById('liked').value='';
  show('success');
}
function renderDashboard(){
  const list=JSON.parse(localStorage.getItem('rideSmileFeedback')||'[]');
  const avg=list.length?list.reduce((a,b)=>a+b.rating,0)/list.length:0;
  document.getElementById('total').textContent=list.length;
  document.getElementById('avg').textContent=avg.toFixed(1)+' ★';
  document.getElementById('replied').textContent=list.filter(x=>x.replied).length;
  document.getElementById('pending').textContent=list.filter(x=>!x.replied).length;
  document.getElementById('feedbackList').innerHTML=list.length?list.map(x=>`<div class="card"><div class="row"><b>${x.id}</b><span>${'★'.repeat(x.rating)}</span></div><p>${escapeHtml(x.liked||x.issue||'No written comment.')}</p><div class="row"><small>${x.replied?'Replied':'Pending'}</small><small>${x.replied?'✓':''}</small></div></div>`).join(''):'<div class="card"><p>No feedback yet. Your first response will appear here.</p></div>';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
