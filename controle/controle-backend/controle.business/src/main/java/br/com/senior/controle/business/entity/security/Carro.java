package br.com.senior.controle.business.entity.security;

import br.com.senior.controle.lib.generator.annotations.GenHint;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "carro")
public class Carro {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @GenHint(label = true)
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "placa")
    @Basic(fetch = FetchType.LAZY)
    private String placa;

    @Column(name = "renavam")
    @Basic(fetch = FetchType.LAZY)
    private String renavam;

    @Column(name = "vendedor")
    @Basic(fetch = FetchType.LAZY)
    private String vendedor;

    @Column(name = "comprador")
    @Basic(fetch = FetchType.LAZY)
    private String comprador;

    @Column(name = "valor_compra")
    @Basic(fetch = FetchType.LAZY)
    private BigDecimal valorCompra;

    @Column(name = "valor_venda")
    @Basic(fetch = FetchType.LAZY)
    private BigDecimal valorVenda;

    @Column(name = "data")
    private LocalDate data;

    @OneToMany(mappedBy = "carro", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Anexo> imagens = new ArrayList<>();

    public Carro(Long id) {
        this.id = id;
    }
}
