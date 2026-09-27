package br.com.infnet.review.controller;

import br.com.infnet.review.config.RabbitMQConfig;
import br.com.infnet.review.domain.Avaliacao;
import br.com.infnet.review.event.AvaliacaoEvent;
import br.com.infnet.review.repository.AvaliacaoRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository repository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/produto/{produtoId}")
    public List<Avaliacao> listarPorProduto(@PathVariable Long produtoId) {
        return repository.findByProdutoId(produtoId);
    }

    @PostMapping
    public ResponseEntity<Avaliacao> criar(@RequestBody Avaliacao avaliacao) {
        Avaliacao salva = repository.save(avaliacao);

        AvaliacaoEvent evento = new AvaliacaoEvent(
                salva.getId(),
                salva.getProdutoId(),
                salva.getAutor(),
                salva.getNota(),
                salva.getComentario()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, evento);
        System.out.println(" [x] Evento enviado ao RabbitMQ para o produto ID: " + salva.getProdutoId());

        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }
}