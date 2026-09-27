package br.com.infnet.review;

import br.com.infnet.review.domain.Avaliacao;
import br.com.infnet.review.repository.AvaliacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AvaliacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Test
    @DisplayName("Deve criar uma avaliacao via POST com sucesso")
    void deveCriarAvaliacao() throws Exception {
        String json = """
            {
                "produtoId": 1,
                "autor": "Larissa",
                "comentario": "Excelente produto!",
                "nota": 5
            }
        """;

        mockMvc.perform(post("/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.autor").value("Larissa"))
                .andExpect(jsonPath("$.nota").value(5));
    }

    @Test
    @DisplayName("Deve listar avaliacoes de um produto por ID via GET")
    void deveListarAvaliacoesPorProduto() throws Exception {
        avaliacaoRepository.save(new Avaliacao(1L, 2L, "Carlos", 4, "Muito bom"));

        mockMvc.perform(get("/avaliacoes/produto/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].produtoId").value(2))
                .andExpect(jsonPath("$[0].autor").value("Carlos"));
    }
}
