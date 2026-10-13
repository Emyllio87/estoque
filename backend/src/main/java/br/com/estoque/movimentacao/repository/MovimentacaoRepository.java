package br.com.estoque.movimentacao.repository;

import br.com.estoque.movimentacao.entity.Movimentacao;
import br.com.estoque.produto.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByProduto(Produto produto);
    List<Movimentacao> findByTipo(Movimentacao.Tipo tipo);
    List<Movimentacao> findByProdutoAndTipo(Produto produto, Movimentacao.Tipo tipo);
    List<Movimentacao> findByCriadoEmBetween(LocalDateTime inicio, LocalDateTime fim);
}