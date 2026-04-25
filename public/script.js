let editandoId = null;

async function carregarProdutos() {
  const res = await fetch('/produtos');
  let produtos = await res.json();

  const busca = document.getElementById('busca')?.value.toLowerCase() || '';
  const categoria = document.getElementById('categoriaFiltro')?.value || '';
  const precoMax = Number(document.getElementById('precoMax')?.value || 99999);

  produtos = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca) &&
    (categoria === '' || p.categoria === categoria) &&
    p.preco <= precoMax
  );

  const container = document.getElementById('produtos');

  if (container) {
    container.innerHTML = produtos.map(p => `
      <div class="card">
        <img src="${p.imagem}">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <strong>R$ ${p.preco}</strong>
        <p class="${!p.disponivel ? 'indisponivel' : ''}">
          ${p.disponivel ? 'Disponível' : 'Indisponível'}
        </p>
      </div>
    `).join('');
  }

  const adminContainer = document.getElementById('adminProdutos');

  if (adminContainer) {
    adminContainer.innerHTML = produtos.map(p => `
      <div class="card">
        <h3>${p.nome}</h3>
        <button onclick="editar(${p.id})">Editar</button>
        <button onclick="remover(${p.id})">Excluir</button>
      </div>
    `).join('');
  }
}

document.getElementById('form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const produto = {
    nome: nome.value,
    descricao: descricao.value,
    categoria: categoria.value,
    preco: Number(preco.value),
    imagem: imagem.value,
    disponivel: disponivel.value === 'true'
  };

  if (editandoId) {
    await fetch(`/produtos/${editandoId}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(produto)
    });
    editandoId = null;
  } else {
    await fetch('/produtos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(produto)
    });
  }

  form.reset();
  carregarProdutos();
});

async function remover(id) {
  await fetch(`/produtos/${id}`, {
    method: 'DELETE'
  });
  carregarProdutos();
}

async function editar(id) {
  const res = await fetch('/produtos');
  const produtos = await res.json();

  const produto = produtos.find(p => p.id === id);

  nome.value = produto.nome;
  descricao.value = produto.descricao;
  categoria.value = produto.categoria;
  preco.value = produto.preco;
  imagem.value = produto.imagem;
  disponivel.value = produto.disponivel.toString();

  editandoId = id;
}

document.getElementById('busca')?.addEventListener('input', carregarProdutos);
document.getElementById('categoriaFiltro')?.addEventListener('change', carregarProdutos);
document.getElementById('precoMax')?.addEventListener('input', carregarProdutos);

carregarProdutos();