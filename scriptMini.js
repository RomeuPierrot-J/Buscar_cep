const form = document.getElementById('form');
const input = document.getElementById('cep');
const btn = document.getElementById('btn');
const resultado = document.getElementById('resultado');

input.addEventListener('input', () => {
  let v = input.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  input.value = v;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cep = input.value.replace(/\D/g, '');
  resultado.innerHTML = '';

  if (cep.length !== 8) {
    resultado.innerHTML = '<p class="erro">Digite um CEP válido com 8 dígitos.</p>';
    return;
  }

  btn.disabled = true;
  btn.textContent = '...';

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      resultado.innerHTML = '<p class="erro">CEP não encontrado.</p>';
    } else {
      resultado.innerHTML = `
        <div class="resultado">
          <div class="linha"><span>Rua</span><span>${data.logradouro || '—'}</span></div>
          <div class="linha"><span>Bairro</span><span>${data.bairro || '—'}</span></div>
          <div class="linha"><span>Cidade</span><span>${data.localidade}</span></div>
          <div class="linha"><span>Estado</span><span>${data.uf}</span></div>
          <div class="linha"><span>CEP</span><span>${data.cep}</span></div>
        </div>
      `;
    }
  } catch {
    resultado.innerHTML = '<p class="erro">Erro ao buscar o CEP. Tente novamente.</p>';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Buscar';
  }
});