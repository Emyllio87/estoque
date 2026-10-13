import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, CardBody, Spinner, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { api } from '../../services/api';
import { Produto } from '../../types';

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/produtos', { params: search ? { nome: search } : {} });
      setProdutos(resp.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      carregar();
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao excluir');
    }
  };

  const handleToggle = async (p: Produto) => {
    try {
      await api.put(`/produtos/${p.id}`, { ...p, ativo: !p.ativo });
      carregar();
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao atualizar');
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <Card className="shadow-sm">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Produtos</h3>
          <Link to="/produtos/novo"><Button variant="primary"><i className="bi bi-plus-lg me-1"></i>Novo Produto</Button></Link>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        <Form className="mb-3" onSubmit={e => e.preventDefault()}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
        </Form>

        <div className="table-responsive">
          <Table striped hover size="sm" className="align-middle">
            <thead className="table-light">
              <tr><th>Código</th><th>Nome</th><th>Estoque</th><th>Mín.</th><th>Un.</th><th>Custo</th><th>Venda</th><th>Status</th><th className="text-end">Ações</th></tr>
            </thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nome}</td>
                  <td><Badge variant={p.estoqueBaixo ? 'danger' : 'success'}>{p.quantidadeAtual}</Badge></td>
                  <td>{p.quantidadeMinima}</td>
                  <td>{p.unidade}</td>
                  <td>{parseFloat(p.precoCusto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>{parseFloat(p.precoVenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td><Badge variant={p.ativo ? 'success' : 'secondary'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" as={Link} to={`/produtos/${p.id}`} className="me-1"><i className="bi bi-pencil"></i></Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => handleToggle(p)} className="me-1"><i className={p.ativo ? 'bi bi-toggle-on' : 'bi bi-toggle-off'}></i></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}><i className="bi bi-trash"></i></Button>
                  </td>
                </tr>
              ))}
              {produtos.length === 0 && <tr><td colSpan={9} className="text-center text-muted py-4">Nenhum produto</td></tr>}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}

export default Produtos;