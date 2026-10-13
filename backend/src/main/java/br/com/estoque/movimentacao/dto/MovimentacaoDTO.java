package br.com.estoque.movimentacao.dto;

import br.com.estoque.movimentacao.entity.Movimentacao;
import br.com.estoque.produto.entity.Produto;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MovimentacaoDTO {
    private Long id;

    @NotNull(message = "Produto é obrigatório")
    private Long produtoId;

    private String produtoCodigo;
    private String produtoNome;

    @NotNull(message = "Tipo é obrigatório")
    private Movimentacao.Tipo tipo;

    @NotNull(message = "Quantidade é obrigatória")
    @DecimalMin(value = "0.001", inclusive = true, message = "Quantidade deve ser maior que zero")
    private BigDecimal quantidade;

    @DecimalMin(value = "0.0", inclusive = true, message = "Valor unitário deve ser maior ou igual a zero")
    private BigDecimal valorUnitario;

    @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
    private String observacao;

    @Size(max = 200, message = "Usuário deve ter no máximo 200 caracteres")
    private String usuario;

    private LocalDateTime criadoEm;

    public static MovimentacaoDTO fromEntity(Movimentacao m) {
        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setId(m.getId());
        dto.setProdutoId(m.getProduto().getId());
        dto.setProdutoCodigo(m.getProduto().getCodigo());
        dto.setProdutoNome(m.getProduto().getNome());
        dto.setTipo(m.getTipo());
        dto.setQuantidade(m.getQuantidade());
        dto.setValorUnitario(m.getValorUnitario());
        dto.setObservacao(m.getObservacao());
        dto.setUsuario(m.getUsuario());
        dto.setCriadoEm(m.getCriadoEm());
        return dto;
    }
}