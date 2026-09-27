package br.com.infnet.review.event;

import java.io.Serializable;

public class AvaliacaoEvent implements Serializable {
    private Long id;
    private Long produtoId;
    private String autor;
    private Integer nota;
    private String comentario;

    public AvaliacaoEvent() {
    }

    public AvaliacaoEvent(Long id, Long produtoId, String autor, Integer nota, String comentario) {
        this.id = id;
        this.produtoId = produtoId;
        this.autor = autor;
        this.nota = nota;
        this.comentario = comentario;
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

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}