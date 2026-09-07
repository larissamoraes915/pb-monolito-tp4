package br.com.infnet.review.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long produtoId;
    private String autor;
    private String comentario;
    private Integer nota;

    public Avaliacao() {}

    public Avaliacao(Long produtoId, String autor, String comentario, Integer nota) {
        this.produtoId = produtoId;
        this.autor = autor;
        this.comentario = comentario;
        this.nota = nota;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public Long getProdutoId() { 
        return produtoId; 
    }
    
    public void setProdutoId(Long produtoId) { 
        this.produtoId = produtoId; 
    }
    
    public String getAutor() { 
        return autor; 
    }
    
    public void setAutor(String autor) { 
        this.autor = autor; 
    }
    
    public String getComentario() { 
        return comentario; 
    }
    
    public void setComentario(String comentario) { 
        this.comentario = comentario; 
    }
    
    public Integer getNota() { 
        return nota; 
    }
    
    public void setNota(Integer nota) { 
        this.nota = nota; 
    }
}