import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/produto/Produtos';
import ProdutoForm from './pages/produto/ProdutoForm';
import Movimentacoes from './pages/movimentacao/Movimentacoes';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/novo" element={<ProdutoForm />} />
        <Route path="/produtos/:id" element={<ProdutoForm />} />
        <Route path="/movimentacoes" element={<Movimentacoes />} />
      </Route>
    </Routes>
  );
}

export default App;