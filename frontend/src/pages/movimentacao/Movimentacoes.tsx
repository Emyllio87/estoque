import { useState, useEffect } from 'react';
import { Table, Button, Card, CardBody, Spinner, Badge, Form, Alert, Modal } from 'react-bootstrap';
import { api } from '../../services/api';
import { Movimentacao, MovimentacaoFormData } from '../../types';

function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<{id: number, codigo: string, nome: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState<'entrada' | 'saida' | 'ajuste' | null>(null);
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
  const [form, setForm] = useState<MovimentacaoFormData>({ produtoId: 0, tipo: 'ENTRADA', quantidade: '', observacao: '', usuario: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [produtoIdFilter, setProdutoIdFilter] = useState<number | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const [movResp, prodResp] = await Promise.all([
        api.get('/movimentacoes', { params: produtoIdFilter ? { produtoId: produtoIdFilter } : {} }),
        api.get('/produtos/ativos'),
      ]);
      setMovimentacoes(movResp.data);
      setProdutos(prodResp.data.map((p: any) => ({ id: p.id, codigo: p.codigo, nome: p.nome })));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [produtoIdFilter]);

  const abrirModal = (tipo: 'entrada' | 'saida' | 'ajuste', produtoId?: number) => {
    setEditMode(tipo);
    setSelectedProdutoId(produtoId || null);
    setForm({ produtoId: produtoId || 0, tipo: tipo.toUpperCase() as any, quantidade: '', observacao: '', usuario: '' });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditMode(null);
    setSelectedProdutoId(null);
    setForm({ produtoId: 0, tipo: 'ENTRADA', quantidade: '', observacao: '', usuario: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.produtoId || !form.quantidade) return;
    setSubmitting(true);
    setError(null);
    try {
      const endpoint = form.tipo === 'ENTRADA' ? '/movimentacoes/entrada' :
                       form.tipo === 'SAIDA' ? '/movimentacoes/saida' : '/movimentacoes/ajuste';
      await api.post(endpoint, form, { params: { produtoId: form.produtoId } });
      fecharModal();
      carregar();
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao registrar');
    } finally {
      setSubmitting(false);
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
      ENTRADA: 'success', SAIDA: 'danger', AJUSTE: 'warning'
    };
    return <Badge variant={variants[tipo] || 'secondary'}>{tipo}</Badge>;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <>
      <Card className="shadow-sm mb-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Movimentações</h3>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={() => abrirModal('entrada')}>Entrada</Button>
              <Button variant="danger" onClick={() => abrirModal('saida')}>Saída</Button>
              <Button variant="warning" onClick={() => abrirModal('ajuste')}>Ajuste</Button>
            </div>
          </div>

          <Form className="mb-3 d-flex gap-2" onSubmit={e => e.preventDefault()}>
            <Form.Control as="select" value={produtoIdFilter} onChange={e => setProdutoIdFilter(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Todos os produtos</option>
              {produtos.map(p => <option key={p.id} value={p.id}>{p.codigo} - {p.nome}</option>)}
            </Form.Control>
          </Form>
        </CardBody>
      </Card>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm">
        <CardBody>
          <div className="table-responsive">
            <Table striped hover size="sm" className="align-middle">
              <thead className="table-light">
                <tr><th>Data/Hora</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Vlr Unit.</th><th>Usuário</th><th>Obs.</th></tr>
              </thead>
              <tbody>
                {movimentacoes.map(m => (
                  <tr key={m.id}>
                    <td>{new Date(m.criadoEm).toLocaleString('pt-BR')}</td>
                    <td>{m.produtoCodigo} - {m.produtoNome}</td>
                    <td>{getTipoBadge(m.tipo)}</td>
                    <td>{parseFloat(m.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}</td>
                    <td>{m.valorUnitario ? parseFloat(m.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                    <td>{m.usuario || '-'}</td>
                    <td>{m.observacao || '-'}</td>
                  </tr>
                ))}
                {movimentacoes.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Nenhuma movimentação</td></tr>}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <Modal show={showModal} onHide={fecharModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode === 'entrada' ? 'Entrada' : editMode === 'saida' ? 'Saída' : 'Ajuste'} de Estoque</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Produto</Form.Label>
              <Form.Control as="select" value={form.produtoId} onChange={e => setForm({...form, produtoId: Number(e.target.value)})} disabled={!!selectedProdutoId} required>
                <option value="">Selecione...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.codigo} - {p.nome}</option>)}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control type="number" step="0.001" min="0.001" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Unitário (opcional)</Form.Label>
              <Form.Control type="number" step="0.01" min="0" value={form.valorUnitario || ''} onChange={e => setForm({...form, valorUnitario: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Usuário (opcional)</Form.Label>
              <Form.Control value={form.usuario || ''} onChange={e => setForm({...form, usuario: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observação (opcional)</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.observacao || ''} onChange={e => setForm({...form, observacao: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModal} disabled={submitting}>Cancelar</Button>
            <Button variant={editMode === 'saida' ? 'danger' : editMode === 'entrada' ? 'success' : 'warning'} type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Registrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Movimentacoes;