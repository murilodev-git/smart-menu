const express = require('express');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;
const DB = './db.json';

app.use(express.json());
app.use(express.static('public'));

async function lerProdutos() {
  return await fs.readJson(DB);
}

async function salvarProdutos(produtos) {
  await fs.writeJson(DB, produtos);
}

app.get('/produtos', async (req, res) => {
  res.json(await lerProdutos());
});

app.post('/produtos', async (req, res) => {
  const produtos = await lerProdutos();

  const novoId = produtos.length > 0
    ? Math.max(...produtos.map(p => p.id)) + 1
    : 1;

  const novoProduto = {
    id: novoId,
    ...req.body
  };

  produtos.push(novoProduto);
  await salvarProdutos(produtos);

  res.json(novoProduto);
});

app.put('/produtos/:id', async (req, res) => {
  const produtos = await lerProdutos();
  const index = produtos.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos[index] = {
    ...produtos[index],
    ...req.body
  };

  await salvarProdutos(produtos);

  res.json(produtos[index]);
});

app.delete('/produtos/:id', async (req, res) => {
  const produtos = await lerProdutos();
  const novos = produtos.filter(p => p.id != req.params.id);

  await salvarProdutos(novos);

  res.json({ mensagem: 'Produto removido' });
});

app.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
});