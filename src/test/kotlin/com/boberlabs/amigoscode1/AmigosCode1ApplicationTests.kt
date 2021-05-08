package com.boberlabs.amigoscode1

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class AmigosCode1ApplicationTests {

    @Test
    fun itAdds2Nums() {
        //given
        val numberOne = 20
        val numberTwo = 30
        //when
        val result = underTest.add(numberOne, numberTwo)
        //then
        val expected = 50
        assertThat(result).isEqualTo(expected)
    }

    class Calculator {
        fun add(a: Int, b: Int): Int {
            return a + b
        }
    }

    val underTest = Calculator()
}
