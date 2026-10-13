package br.com.estoque.produto.repository;

import br.com.estoque.produto.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByCodigo(String codigo);
    List<Produto> findByAtivoTrue();
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    boolean existsByCodigo(String codigo);
}