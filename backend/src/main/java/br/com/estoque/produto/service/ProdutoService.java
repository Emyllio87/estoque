package br.com.estoque.produto.service;

import br.com.estoque.produto.dto.ProdutoDTO;
import br.com.estoque.produto.entity.Produto;
import br.com.estoque.produto.repository.ProdutoRepository;
import br.com.estoque.comum.exception.BusinessException;
import br.com.estoque.comum.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(ProdutoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarAtivos() {
        return produtoRepository.findByAtivoTrue().stream()
                .map(ProdutoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome).stream()
                .map(ProdutoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Long id) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + id));
        return ProdutoDTO.fromEntity(p);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorCodigo(String codigo) {
        Produto p = produtoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + codigo));
        return ProdutoDTO.fromEntity(p);
    }

    @Transactional
    public ProdutoDTO criar(ProdutoDTO dto) {
        if (produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Código já cadastrado: " + dto.getCodigo());
        }
        Produto p = toEntity(dto);
        return ProdutoDTO.fromEntity(produtoRepository.save(p));
    }

    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoDTO dto) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + id));

        if (!p.getCodigo().equals(dto.getCodigo()) && produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Código já cadastrado: " + dto.getCodigo());
        }

        p.setCodigo(dto.getCodigo());
        p.setNome(dto.getNome());
        p.setDescricao(dto.getDescricao());
        p.setUnidade(dto.getUnidade());
        p.setQuantidadeAtual(dto.getQuantidadeAtual());
        p.setQuantidadeMinima(dto.getQuantidadeMinima());
        p.setPrecoCusto(dto.getPrecoCusto());
        p.setPrecoVenda(dto.getPrecoVenda());
        p.setAtivo(dto.getAtivo());

        return ProdutoDTO.fromEntity(produtoRepository.save(p));
    }

    @Transactional
    public void excluir(Long id) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + id));
        produtoRepository.delete(p);
    }

    @Transactional
    public void ajustarEstoque(Long id, java.math.BigDecimal novaQuantidade) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado: " + id));
        p.setQuantidadeAtual(novaQuantidade);
        produtoRepository.save(p);
    }

    private Produto toEntity(ProdutoDTO dto) {
        Produto p = new Produto();
        p.setCodigo(dto.getCodigo());
        p.setNome(dto.getNome());
        p.setDescricao(dto.getDescricao());
        p.setUnidade(dto.getUnidade());
        p.setQuantidadeAtual(dto.getQuantidadeAtual());
        p.setQuantidadeMinima(dto.getQuantidadeMinima());
        p.setPrecoCusto(dto.getPrecoCusto());
        p.setPrecoVenda(dto.getPrecoVenda());
        p.setAtivo(dto.getAtivo());
        return p;
    }
}