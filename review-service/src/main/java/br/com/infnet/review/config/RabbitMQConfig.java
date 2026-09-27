package br.com.infnet.review.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "reviews.exchange";
    public static final String QUEUE_NAME = "reviews.notificacao.queue";
    public static final String ROUTING_KEY = "reviews.nova";

    @Bean
    public TopicExchange reviewsExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue reviewsQueue() {
        return QueueBuilder.durable(QUEUE_NAME).build();
    }

    @Bean
    public Binding binding(Queue reviewsQueue, TopicExchange reviewsExchange) {
        return BindingBuilder.bind(reviewsQueue).to(reviewsExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}