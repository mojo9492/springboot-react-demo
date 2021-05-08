package com.boberlabs.amigoscode1.student

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class StudRepositoryTest {

    @Autowired
    private lateinit var underTest: StudRepository

    @Test
    fun itShouldCheckIfStudEmailExists() {
        //given
        val email = "xenabeans@boberlabs.com"
        val stud = Stud(
            id = 1,
            name = "Xena",
            email = email,
            gender = Gender.FEMALE
            )
        underTest.save(stud)
        //when
        val expected: Boolean = underTest.selectExistsEmail(email)
        //then
        assertThat(expected).isTrue
    }
    @Test
    fun itShouldCheckIfStudEmailDoesNotExists() {
        //given
        val email = "xenabeans@boberlabs.com"
        //when
        val expected: Boolean = underTest.selectExistsEmail(email)
        //then
        assertThat(expected).isFalse
    }
}