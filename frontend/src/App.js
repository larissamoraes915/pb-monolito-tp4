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
  const [loading, setLoading] = useState(false);

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
      console.error(err);
    }
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !preco) return;
    try {
      await fetch(API_PRODUTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), preco: parseFloat(preco) }),
      });
      setNome('');
      setPreco('');
      carregarProdutos();
    } catch (err) {
      console.error(err);
    }
  };

  const selecionarProduto = async (prod) => {
    setProdutoSelecionado(prod);
    carregarAvaliacoes(prod.id);
  };

  const carregarAvaliacoes = async (prodId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_AVALIACOES}/produto/${prodId}`);
      const data = await res.json();
      setAvaliacoes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    if (!produtoSelecionado || !autor.trim() || !comentario.trim()) return;

    try {
      await fetch(API_AVALIACOES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produtoSelecionado.id,
          autor: autor.trim(),
          comentario: comentario.trim(),
          nota: parseInt(nota),
        }),
      });
      setAutor('');
      setComentario('');
      setNota(5);
      carregarAvaliacoes(produtoSelecionado.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.canvas}>
      <header style={styles.topbar}>
        <div style={styles.topbarWrapper}>
          <div style={styles.brandBox}>
            <div style={styles.brandIcon}>P</div>
            <div>
              <h1 style={styles.brandTitle}>Loja & Comunidade</h1>
              <span style={styles.brandSubtitle}>Gestão de Produtos e Opiniões de Clientes</span>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.container}>
        <section style={styles.heroFormCard}>
          <div style={styles.sectionHeader}>
            <span style={styles.pillAction}>Cadastro</span>
            <h2 style={styles.cardHeadingInline}>Novo Produto</h2>
          </div>
          <form onSubmit={salvarProduto} style={styles.formGrid}>
            <input
              type="text"
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.fieldInput}
              required
            />
            <div style={styles.priceWrap}>
              <span style={styles.pricePrefix}>R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                style={styles.fieldPrice}
                required
              />
            </div>
            <button type="submit" style={styles.btnPrimary}>
              Salvar Produto
            </button>
          </form>
        </section>

        <div style={styles.layoutTwoCols}>
          <section style={styles.surfaceCardLilac}>
            <div style={styles.cardHeadingRow}>
              <div>
                <h2 style={styles.cardHeading}>Catálogo</h2>
                <p style={styles.cardDescription}>Selecione um item para ver o feedback</p>
              </div>
              <span style={styles.countBadgeLilac}>{produtos.length}</span>
            </div>

            {produtos.length === 0 ? (
              <div style={styles.emptyPrompt}>
                <p style={styles.emptyPromptText}>Nenhum produto cadastrado até o momento.</p>
              </div>
            ) : (
              <div style={styles.itemsStack}>
                {produtos.map((p) => {
                  const isSelected = produtoSelecionado?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => selecionarProduto(p)}
                      style={{
                        ...styles.productCard,
                        borderColor: isSelected ? '#a855f7' : '#ede9fe',
                        backgroundColor: isSelected ? '#f5f3ff' : '#ffffff',
                      }}
                    >
                      <div>
                        <div style={styles.productName}>{p.nome}</div>
                        <div style={styles.productPrice}>
                          R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div style={{
                        ...styles.selectionPill,
                        backgroundColor: isSelected ? '#9333ea' : '#f3e8ff',
                        color: isSelected ? '#ffffff' : '#7e22ce',
                      }}>
                        {isSelected ? 'Selecionado' : 'Ver'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section style={styles.surfaceCardGreen}>
            {!produtoSelecionado ? (
              <div style={styles.blankReviewsState}>
                <h3 style={styles.blankTitle}>Nenhum item selecionado</h3>
                <p style={styles.blankText}>
                  Escolha um item ao lado para consultar os comentários e notas deixadas pelos clientes.
                </p>
              </div>
            ) : (
              <div>
                <div style={styles.reviewBanner}>
                  <div>
                    <span style={styles.reviewTargetSubtitle}>Avaliações do item</span>
                    <h2 style={styles.reviewTargetTitle}>{produtoSelecionado.nome}</h2>
                  </div>
                  <span style={styles.reviewStatPill}>
                    {avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
                  </span>
                </div>

                <form onSubmit={enviarAvaliacao} style={styles.commentFormBox}>
                  <div style={styles.commentInputsRow}>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      style={styles.fieldInput}
                      required
                    />
                    <select
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                      style={styles.fieldSelect}
                    >
                      <option value="5">Nota 5 de 5</option>
                      <option value="4">Nota 4 de 5</option>
                      <option value="3">Nota 3 de 5</option>
                      <option value="2">Nota 2 de 5</option>
                      <option value="1">Nota 1 de 5</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Compartilhe o que você achou deste produto..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    style={styles.fieldTextarea}
                    rows="3"
                    required
                  />
                  <div style={styles.formFooter}>
                    <button type="submit" style={styles.btnReview}>
                      Enviar Avaliação
                    </button>
                  </div>
                </form>

                <div style={styles.reviewsFeed}>
                  {loading ? (
                    <div style={styles.emptyPrompt}>Carregando opiniões...</div>
                  ) : avaliacoes.length === 0 ? (
                    <div style={styles.emptyPrompt}>Ainda não há avaliações cadastradas para este produto.</div>
                  ) : (
                    avaliacoes.map((av) => (
                      <div key={av.id} style={styles.reviewBalloon}>
                        <div style={styles.reviewBalloonHeader}>
                          <div style={styles.userBadgeWrap}>
                            <div style={styles.avatarCircle}>
                              {av.autor ? av.autor.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span style={styles.avatarName}>{av.autor}</span>
                          </div>
                          <span style={styles.scoreText}>Nota {av.nota}/5</span>
                        </div>
                        <p style={styles.reviewBalloonText}>{av.comentario}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  canvas: {
    backgroundColor: '#faf8fc',
    minHeight: '100vh',
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#334155',
    paddingBottom: '60px',
  },
  topbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f1eef8',
    padding: '18px 0',
    marginBottom: '28px',
    boxShadow: '0 2px 4px rgba(147, 51, 234, 0.02)',
  },
  topbarWrapper: {
    maxWidth: '1160px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
  },
  brandTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#4a044e',
    letterSpacing: '-0.02em',
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#701a75',
    fontWeight: 500,
    opacity: 0.8,
  },
  container: {
    maxWidth: '1160px',
    margin: '0 auto',
    padding: '0 24px',
  },
  heroFormCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f3e8ff',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.04)',
    marginBottom: '28px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  cardHeadingInline: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#4a044e',
  },
  pillAction: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#7e22ce',
    backgroundColor: '#f3e8ff',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  formGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  fieldInput: {
    flex: 2,
    minWidth: '220px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e9d5ff',
    fontSize: '14px',
    color: '#334155',
    outline: 'none',
    backgroundColor: '#faf8fc',
  },
  priceWrap: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid #e9d5ff',
    backgroundColor: '#faf8fc',
    padding: '0 12px',
    flex: 1,
    minWidth: '130px',
  },
  pricePrefix: {
    color: '#a855f7',
    fontSize: '13px',
    fontWeight: 600,
    marginRight: '6px',
  },
  fieldPrice: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#334155',
    backgroundColor: 'transparent',
  },
  btnPrimary: {
    backgroundColor: '#9333ea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  layoutTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  surfaceCardLilac: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #ede9fe',
    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.03)',
  },
  surfaceCardGreen: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #dcfce7',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.03)',
  },
  cardHeadingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '18px',
  },
  cardHeading: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#581c87',
  },
  cardDescription: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#7e22ce',
    opacity: 0.7,
  },
  countBadgeLilac: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    fontSize: '12px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '20px',
  },
  emptyPrompt: {
    textAlign: 'center',
    padding: '40px 16px',
    color: '#94a3b8',
    fontSize: '13px',
  },
  emptyPromptText: {
    margin: 0,
  },
  itemsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  productCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #ede9fe',
    cursor: 'pointer',
  },
  productName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#3b0764',
  },
  productPrice: {
    fontSize: '13px',
    color: '#7e22ce',
    fontWeight: 600,
    marginTop: '2px',
  },
  selectionPill: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: '20px',
  },
  blankReviewsState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  blankTitle: {
    margin: '0 0 8px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#166534',
  },
  blankText: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
    maxWidth: '280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.5',
  },
  reviewBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '14px',
    borderBottom: '1px solid #dcfce7',
  },
  reviewTargetSubtitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#15803d',
  },
  reviewTargetTitle: {
    margin: '2px 0 0',
    fontSize: '20px',
    fontWeight: 800,
    color: '#14532d',
  },
  reviewStatPill: {
    fontSize: '12px',
    backgroundColor: '#dcfce7',
    color: '#14532d',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '16px',
  },
  commentFormBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
    backgroundColor: '#f0fdf4',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0',
  },
  commentInputsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  fieldSelect: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #bbf7d0',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    color: '#14532d',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
  },
  fieldTextarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #bbf7d0',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    backgroundColor: '#ffffff',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btnReview: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  reviewsFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reviewBalloon: {
    backgroundColor: '#ffffff',
    border: '1px solid #dcfce7',
    borderRadius: '12px',
    padding: '14px 16px',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.03)',
  },
  reviewBalloonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  userBadgeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatarCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
  },
  avatarName: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1e293b',
  },
  scoreText: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  reviewBalloonText: {
    margin: 0,
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.5',
  },
};

export default App;