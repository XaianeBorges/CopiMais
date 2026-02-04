package com.gerenciamento.copimais.service;

import java.math.BigDecimal;
import java.util.List;

import com.gerenciamento.copimais.dtos.VendaRequestDTO;
import com.gerenciamento.copimais.model.ItemVenda;
import com.gerenciamento.copimais.model.Usuario;
import com.gerenciamento.copimais.repository.ProdutoRepository;
import com.gerenciamento.copimais.repository.UsuarioRepository;
import com.gerenciamento.copimais.repository.VendaRepository;

import jakarta.transaction.Transactional;

public class VendaService {

    private final VendaRepository vendaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;

    public VendaService(VendaRepository vendaRepository, UsuarioRepository usuarioRepository, ProdutoRepository produtoRepository) {
        this.vendaRepository = vendaRepository;
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Venda realizarVenda(VendaRequestDTO request){
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Venda venda = new venda();
        venda.setUsuario(usuario);
        venda.setDataVenda(LocalDateTime.now());
        
        Bigdecimal valorTotal = BigDecimal.ZERO;
        List<ItemVenda> itensVenda = new ArrayList<>();

        for (ItemVendaRequestDTO itemRequeast : request.getItens()) {

            Produto produto = produtoRepository.findById(itemRequest.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            
            if(produto.getQuantidadeEstoque() < itemRequest.getQuantidade()){
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);  
            itemVenda.setVenda(venda);
            itemVenda.setQuantidade(itemRequest.getQuantidade());
            itemVenda.setPrecoVendaUnitario(produto.getPrecoVenda());
            itemVenda.setPrecoCompraUnnitario(produto.getPrecoCompra());

            BigDecimal subtotal = produto.getPrecoVenda()
                .multiply(BigDecimal.valueOf(itemRequest.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemRequest.getQuantidade());

            produtoRepository.save(produto);
            itensVenda.add(itemVenda);
           
        }

        venda.setValorTotal(valorTotal);
        venda.setItens(itensVenda);
        
    }




}
