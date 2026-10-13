package br.com.estoque.produto.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, length = 20)
    private String unidade = "UN";

    @Column(name = "quantidade_atual", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;

    @Column(name = "quantidade_minima", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantidadeMinima = BigDecimal.ZERO;

    @Column(name = "preco_custo", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoCusto = BigDecimal.ZERO;

    @Column(name = "preco_venda", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoVenda = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private java.time.LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private java.time.LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = java.time.LocalDateTime.now();
        this.atualizadoEm = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = java.time.LocalDateTime.now();
    }

    public boolean isEstoqueBaixo() {
        return quantidadeAtual.compareTo(quantidadeMinima) <= 0;
    }
}