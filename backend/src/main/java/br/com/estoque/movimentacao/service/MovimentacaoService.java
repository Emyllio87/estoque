package br.com.estoque.movimentacao.service;

import br.com.estoque.movimentacao.dto.MovimentacaoDTO;
import br.com.estoque.movimentacao.entity.Movimentacao;
import br.com.estoque.movimentacao.repository.MovimentacaoRepository;
import br.com.estoque.produto.entity.Produto;
import br.com.estoque.produto.repository.ProdutoRepository;
import br.com.estoque.comum.exception.BusinessException;
import br.com.estoque.comum.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<MovimentacaoDTO> listarTodas() {
        return movimentacaoRepository.findAll().stream()
                .map(MovimentacaoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoDTO> listarPorProduto(Long produtoId) {
        Produto p = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + produtoId));
        return movimentacaoRepository.findByProduto(p).stream()
                .map(MovimentacaoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoDTO> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return movimentacaoRepository.findByCriadoEmBetween(inicio, fim).stream()
                .map(MovimentacaoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public MovimentacaoDTO registrarEntrada(Long produtoId, MovimentacaoDTO dto) {
        dto.setTipo(Movimentacao.Tipo.ENTRADA);
        return registrar(dto);
    }

    @Transactional
    public MovimentacaoDTO registrarSaida(Long produtoId, MovimentacaoDTO dto) {
        dto.setTipo(Movimentacao.Tipo.SAIDA);
        return registrar(dto);
    }

    @Transactional
    public MovimentacaoDTO registrarAjuste(Long produtoId, MovimentacaoDTO dto) {
        dto.setTipo(Movimentacao.Tipo.AJUSTE);
        return registrar(dto);
    }

    private MovimentacaoDTO registrar(MovimentacaoDTO dto) {
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + dto.getProdutoId()));

        if (dto.getTipo() == Movimentacao.Tipo.SAIDA) {
            BigDecimal novaQtd = produto.getQuantidadeAtual().subtract(dto.getQuantidade());
            if (novaQtd.compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException("Estoque insuficiente. Atual: " + produto.getQuantidadeAtual());
            }
            produto.setQuantidadeAtual(novaQtd);
        } else if (dto.getTipo() == Movimentacao.Tipo.ENTRADA) {
            produto.setQuantidadeAtual(produto.getQuantidadeAtual().add(dto.getQuantidade()));
        } else if (dto.getTipo() == Movimentacao.Tipo.AJUSTE) {
            produto.setQuantidadeAtual(dto.getQuantidade());
        }

        produtoRepository.save(produto);

        Movimentacao m = new Movimentacao();
        m.setProduto(produto);
        m.setTipo(dto.getTipo());
        m.setQuantidade(dto.getQuantidade());
        m.setValorUnitario(dto.getValorUnitario());
        m.setObservacao(dto.getObservacao());
        m.setUsuario(dto.getUsuario());

        return MovimentacaoDTO.fromEntity(movimentacaoRepository.save(m));
    }
}