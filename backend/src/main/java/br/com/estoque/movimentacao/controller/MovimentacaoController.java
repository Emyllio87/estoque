package br.com.estoque.movimentacao.controller;

import br.com.estoque.movimentacao.dto.MovimentacaoDTO;
import br.com.estoque.movimentacao.service.MovimentacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    @GetMapping
    public ResponseEntity<List<MovimentacaoDTO>> listar(
            @RequestParam(required = false) Long produtoId,
            @RequestParam(required = false) LocalDateTime inicio,
            @RequestParam(required = false) LocalDateTime fim) {

        if (produtoId != null) {
            return ResponseEntity.ok(movimentacaoService.listarPorProduto(produtoId));
        }
        if (inicio != null && fim != null) {
            return ResponseEntity.ok(movimentacaoService.listarPorPeriodo(inicio, fim));
        }
        return ResponseEntity.ok(movimentacaoService.listarTodas());
    }

    @PostMapping("/entrada")
    public ResponseEntity<MovimentacaoDTO> entrada(@RequestParam Long produtoId, @Valid @RequestBody MovimentacaoDTO dto) {
        return ResponseEntity.ok(movimentacaoService.registrarEntrada(produtoId, dto));
    }

    @PostMapping("/saida")
    public ResponseEntity<MovimentacaoDTO> saida(@RequestParam Long produtoId, @Valid @RequestBody MovimentacaoDTO dto) {
        return ResponseEntity.ok(movimentacaoService.registrarSaida(produtoId, dto));
    }

    @PostMapping("/ajuste")
    public ResponseEntity<MovimentacaoDTO> ajuste(@RequestParam Long produtoId, @Valid @RequestBody MovimentacaoDTO dto) {
        return ResponseEntity.ok(movimentacaoService.registrarAjuste(produtoId, dto));
    }
}