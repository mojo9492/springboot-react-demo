package com.boberlabs.amigoscode1.integration

import com.boberlabs.amigoscode1.student.Gender
import com.boberlabs.amigoscode1.student.Stud
import com.boberlabs.amigoscode1.student.StudRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.javafaker.Faker
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@SpringBootTest
@TestPropertySource(locations = ["classpath:application-it.properties"])
@AutoConfigureMockMvc
internal class StudIT {

    @Autowired
    private val mockMvc: MockMvc? = null

    @Autowired
    private val objectMapper: ObjectMapper? = null

    @Autowired
    private lateinit var studRepository: StudRepository

    private val faker = Faker()


    @Test
    @Disabled
    internal fun canRegNewStud() {
        //given
        val name = String.format(
            "%s %s",
            faker.name().firstName(),
            faker.name().lastName()
        )
        val email = String.format("%s@boberlabs.com", name)
        val stud = Stud(
            id = Math.random().toInt(),
            name = name,
            email = email,
            gender = Gender.FEMALE
        )
        //when
        val resultActions: ResultActions = mockMvc!!
            .perform(post("/api/v1/studs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper!!.writeValueAsString(stud)))
        //then
        resultActions.andExpect(status().isOk)
        val studs: List<Stud> = studRepository.findAll()
        assertThat(studs)
            .usingElementComparatorIgnoringFields("id")
            .contains(stud)
    }
}