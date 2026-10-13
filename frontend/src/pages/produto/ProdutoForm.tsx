import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Card, CardBody, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { api } from '../../services/api';
import { ProdutoFormData } from '../../types';

const schema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório').max(50),
  nome: z.string().min(1, 'Nome é obrigatório').max(200),
  descricao: z.string().max(1000).optional().or(z.literal('')),
  unidade: z.string().min(1, 'Unidade é obrigatória').max(20),
  quantidadeAtual: z.string().refine(v => parseFloat(v) >= 0, 'Deve ser >= 0'),
  quantidadeMinima: z.string().refine(v => parseFloat(v) >= 0, 'Deve ser >= 0'),
  precoCusto: z.string().refine(v => parseFloat(v) >= 0, 'Deve ser >= 0'),
  precoVenda: z.string().refine(v => parseFloat(v) >= 0, 'Deve ser >= 0'),
  ativo: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

function ProdutoForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      unidade: 'UN',
      quantidadeAtual: '0',
      quantidadeMinima: '0',
      precoCusto: '0',
      precoVenda: '0',
      ativo: true,
    },
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/produtos/${id}`).then(r => {
        const p = r.data;
        reset({
          codigo: p.codigo,
          nome: p.nome,
          descricao: p.descricao || '',
          unidade: p.unidade,
          quantidadeAtual: p.quantidadeAtual,
          quantidadeMinima: p.quantidadeMinima,
          precoCusto: p.precoCusto,
          precoVenda: p.precoVenda,
          ativo: p.ativo,
        });
        setLoading(false);
      }).catch(err => {
        setError(err.response?.data?.mensagem || 'Erro ao carregar produto');
        setLoading(false);
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...data,
        quantidadeAtual: parseFloat(data.quantidadeAtual),
        quantidadeMinima: parseFloat(data.quantidadeMinima),
        precoCusto: parseFloat(data.precoCusto),
        precoVenda: parseFloat(data.precoVenda),
      };
      if (isEdit) {
        await api.put(`/produtos/${id}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      navigate('/produtos');
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Erro ao salvar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <Card className="shadow-sm">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h3>
          <Button variant="secondary" onClick={() => navigate('/produtos')}>Voltar</Button>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Código</Form.Label>
                <Form.Control {...register('codigo')} isInvalid={!!errors.codigo} />
                <Form.Control.Feedback type="invalid">{errors.codigo?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Unidade</Form.Label>
                <Form.Control {...register('unidade')} isInvalid={!!errors.unidade} />
                <Form.Control.Feedback type="invalid">{errors.unidade?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control {...register('nome')} isInvalid={!!errors.nome} />
                <Form.Control.Feedback type="invalid">{errors.nome?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group>
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('descricao')} />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Qtd. Atual</Form.Label>
                <Form.Control type="number" step="0.001" min="0" {...register('quantidadeAtual')} isInvalid={!!errors.quantidadeAtual} />
                <Form.Control.Feedback type="invalid">{errors.quantidadeAtual?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Qtd. Mínima</Form.Label>
                <Form.Control type="number" step="0.001" min="0" {...register('quantidadeMinima')} isInvalid={!!errors.quantidadeMinima} />
                <Form.Control.Feedback type="invalid">{errors.quantidadeMinima?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Preço Custo</Form.Label>
                <InputGroup>
                  <InputGroup.Text>R$</InputGroup.Text>
                  <Form.Control type="number" step="0.01" min="0" {...register('precoCusto')} isInvalid={!!errors.precoCusto} />
                </InputGroup>
                <Form.Control.Feedback type="invalid">{errors.precoCusto?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Preço Venda</Form.Label>
                <InputGroup>
                  <InputGroup.Text>R$</InputGroup.Text>
                  <Form.Control type="number" step="0.01" min="0" {...register('precoVenda')} isInvalid={!!errors.precoVenda} />
                </InputGroup>
                <Form.Control.Feedback type="invalid">{errors.precoVenda?.message}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mt-4">
                <Form.Check type="switch" {...register('ativo')} id="ativo" label="Ativo" />
              </Form.Group>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/produtos')}>Cancelar</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default ProdutoForm;