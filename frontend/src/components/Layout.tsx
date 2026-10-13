import { Outlet, NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { useState } from 'react';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">Estoque</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <NavLink as={Nav.Link} to="/" className="nav-link">Dashboard</NavLink>
              <NavLink as={Nav.Link} to="/produtos" className="nav-link">Produtos</NavLink>
              <NavLink as={Nav.Link} to="/movimentacoes" className="nav-link">Movimentações</NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="pt-5 pb-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4">
          <Outlet />
        </Container>
      </main>

      <footer className="bg-light border-top py-3 mt-auto">
        <Container fluid className="text-center text-muted small">
          Estoque - Sistema Simples de Controle de Estoque
        </Container>
      </footer>
    </>
  );
}

export default Layout;