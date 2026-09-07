import React, { useState, useEffect } from 'react';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [autor, setAutor] = useState('');
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState(5);

  const API_PRODUTOS = 'http://localhost:8080/api/produtos';
  const API_AVALIACOES = 'http://localhost:8081/avaliacoes';

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch(API_PRODUTOS);
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    if (!nome || !preco) return;
    try {
      await fetch(API_PRODUTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco: parseFloat(preco) }),
      });
      setNome('');
      setPreco('');
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const selecionarProduto = async (prod) => {
    setProdutoSelecionado(prod);
    carregarAvaliacoes(prod.id);
  };

  const carregarAvaliacoes = async (prodId) => {
    try {
      const res = await fetch(`${API_AVALIACOES}/produto/${prodId}`);
      const data = await res.json();
      setAvaliacoes(data);
    } catch (err) {
      console.error('Erro ao buscar avaliações:', err);
    }
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    if (!produtoSelecionado || !autor || !comentario) return;

    try {
      await fetch(API_AVALIACOES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produtoSelecionado.id,
          autor,
          comentario,
          nota: parseInt(nota),
        }),
      });
      setAutor('');
      setComentario('');
      setNota(5);
      carregarAvaliacoes(produtoSelecionado.id);
    } catch (err) {
      console.error('Erro ao salvar avaliação:', err);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Catálogo de Produtos & Microsserviço de Avaliações</h1>

      <section style={{ background: '#f4f6f8', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2>Cadastrar Produto (Serviço Principal - Porta 8080)</h2>
        <form onSubmit={salvarProduto} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ padding: '8px', flex: '2' }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            style={{ padding: '8px', flex: '1' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Salvar
          </button>
        </form>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2>Produtos Cadastrados</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {produtos.map((p) => (
            <li
              key={p.id}
              onClick={() => selecionarProduto(p)}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                marginBottom: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: produtoSelecionado?.id === p.id ? '#e0f2fe' : '#fff',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span><strong>{p.nome}</strong> - R$ {p.preco.toFixed(2)}</span>
              <span style={{ color: '#0284c7', fontSize: '14px' }}>Clique para ver avaliações &rarr;</span>
            </li>
          ))}
        </ul>
      </section>

      {produtoSelecionado && (
        <section style={{ background: '#fefce8', padding: '20px', borderRadius: '8px', border: '1px solid #fef08a' }}>
          <h2>Avaliações de: {produtoSelecionado.nome} (Microsserviço - Porta 8081)</h2>
          
          <form onSubmit={enviarAvaliacao} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Seu nome"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                style={{ padding: '8px', flex: '2' }}
              />
              <select
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                style={{ padding: '8px', flex: '1' }}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <textarea
              placeholder="Escreva seu comentário sobre o produto..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              style={{ padding: '8px', minHeight: '60px' }}
            />
            <button type="submit" style={{ padding: '10px', background: '#eab308', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '200px' }}>
              Enviar Avaliação
            </button>
          </form>

          <div>
            <h3>Opiniões Registradas ({avaliacoes.length})</h3>
            {avaliacoes.length === 0 ? (
              <p style={{ color: '#71717a' }}>Nenhuma avaliação cadastrada para este produto.</p>
            ) : (
              avaliacoes.map((av) => (
                <div key={av.id} style={{ background: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong>{av.autor}</strong>
                    <span>{'⭐'.repeat(av.nota)}</span>
                  </div>
                  <p style={{ margin: 0, color: '#374151' }}>{av.comentario}</p>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;