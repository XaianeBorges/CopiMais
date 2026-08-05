package com.gerenciamento.copimais.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.dtos.ItemVendaRequestDTO;
import com.gerenciamento.copimais.dtos.ItemVendaResponseDTO;
import com.gerenciamento.copimais.dtos.VendaRequestDTO;
import com.gerenciamento.copimais.dtos.VendaResponseDTO;
import com.gerenciamento.copimais.model.ItemVenda;
import com.gerenciamento.copimais.model.Produto;
import com.gerenciamento.copimais.model.Servico;
import com.gerenciamento.copimais.model.Usuario;
import com.gerenciamento.copimais.model.Venda;
import com.gerenciamento.copimais.repository.ProdutoRepository;
import com.gerenciamento.copimais.repository.UsuarioRepository;
import com.gerenciamento.copimais.repository.VendaRepository;
import com.gerenciamento.copimais.repository.ServicoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioSessao sessao; 

    public List<VendaResponseDTO> listarTodas() {
        List<Venda> vendas = vendaRepository.findAllByOrderByDataVendaDesc();
        
        return vendas.stream()
                .map(this::converterParaDTO) 
                .toList();
    }

    @Transactional
    public VendaResponseDTO realizarVenda(VendaRequestDTO request) {
        
        Usuario usuario = usuarioRepository.findById(sessao.getId())
            .orElseThrow(() -> new RuntimeException("Sessão inválida ou usuário não encontrado"));

        Venda venda = new Venda();
        venda.setUsuario(usuario);
        venda.setDataVenda(LocalDateTime.now());
        venda.setFormaPagamento(request.formaPagamento());
        
        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemVenda> itensVenda = new ArrayList<>();

        for (ItemVendaRequestDTO itemReq : request.itens()) {
            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setVenda(venda);
            itemVenda.setQuantidade(itemReq.quantidade());

            if ("PRODUTO".equalsIgnoreCase(itemReq.tipo())) {
                Produto p = produtoRepository.findById(itemReq.id())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
                
                if (p.getQuantidadeEstoque() < itemReq.quantidade()) {
                    throw new RuntimeException("Estoque insuficiente para: " + p.getNome());
                }

                p.setQuantidadeEstoque(p.getQuantidadeEstoque() - itemReq.quantidade());
                itemVenda.setProduto(p);
                itemVenda.setPrecoVendaUnitario(p.getPrecoVenda());
                itemVenda.setPrecoCompraUnitario(p.getPrecoCompra());
                produtoRepository.save(p);

            } else if ("SERVICO".equalsIgnoreCase(itemReq.tipo())) {
                Servico s = servicoRepository.findById(itemReq.id())
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
                
                itemVenda.setServico(s);
                itemVenda.setPrecoVendaUnitario(s.getPreco());
                itemVenda.setPrecoCompraUnitario(s.getPrecoCusto());
            }

            BigDecimal subtotal = itemVenda.getPrecoVendaUnitario()
                .multiply(BigDecimal.valueOf(itemReq.quantidade()));
            
            valorTotal = valorTotal.add(subtotal);
            itensVenda.add(itemVenda);
        }

        venda.setValorTotal(valorTotal);
        venda.setItens(itensVenda);

        Venda vendaSalva = vendaRepository.save(venda);
        return converterParaDTO(vendaSalva);
    }

    private VendaResponseDTO converterParaDTO(Venda v) {
    
    List<ItemVendaResponseDTO> itensDTO = v.getItens().stream()
        .map(item -> new ItemVendaResponseDTO(
            item.getProduto() != null ? item.getProduto().getNome() : item.getServico().getNome(),
            item.getQuantidade(),
            item.getPrecoVendaUnitario()
        )).toList();

    return new VendaResponseDTO(
        v.getId(),
        v.getDataVenda(),
        v.getValorTotal(),
        v.getUsuario().getUsername(),
        v.getFormaPagamento(),
        itensDTO 
    );
}
}