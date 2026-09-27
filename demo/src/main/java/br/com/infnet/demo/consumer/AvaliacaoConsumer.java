package br.com.infnet.demo.consumer;

import br.com.infnet.demo.event.AvaliacaoEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class AvaliacaoConsumer {

    @RabbitListener(queues = "reviews.notificacao.queue")
    public void consumirMensagem(AvaliacaoEvent evento) {
        System.out.println("==================================================");
        System.out.println(" [EVENTO RECEBIDO NO MONÓLITO VIA RABBITMQ]");
        System.out.println(" Produto ID: " + evento.getProdutoId());
        System.out.println(" Autor: " + evento.getAutor());
        System.out.println(" Nota atribuída: " + evento.getNota() + "/5");
        System.out.println(" Comentário: " + evento.getComentario());
        System.out.println("==================================================");
    }
}
