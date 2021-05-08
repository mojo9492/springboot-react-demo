package com.boberlabs.amigoscode1.student

import com.boberlabs.amigoscode1.student.exception.BadRequestException
import com.boberlabs.amigoscode1.student.exception.StudentNotFoundException
import org.assertj.core.api.AssertionsForClassTypes
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.*
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
internal class StudServiceTest {
    //Mock the repository
    @Mock
    private val studRepository: StudRepository? = null
    private var underTest: StudService? = null
    @BeforeEach
    fun setUp() {
        underTest = StudService(studRepository!!)
    }

    @Test
    fun canGetAllStudents() {
        //when
        underTest!!.getAllStuds()
        //then
        Mockito.verify(studRepository)!!.findAll()
    }

    @Test
    fun canAddStudent() {
        //given
        val stud = Stud(
            id = 1,
            "Jobi",
            "jobi@boberlabs.com",
            Gender.MALE
        )
        //when
        underTest!!.addStud(stud)
        //then
        val studArgumentCaptor = ArgumentCaptor.forClass(Stud::class.java)
        Mockito.verify(studRepository)!!.save(studArgumentCaptor.capture())
        val capturedStud = studArgumentCaptor.value
        AssertionsForClassTypes.assertThat(capturedStud).isEqualTo(stud)
    }

    @Test
    fun willThrowWhenEmailIsTaken() {
        //given
        val stud = Stud(
            id = 1,
            "Jobi",
            "jobi@boberlabs.com",
            Gender.MALE
        )
        BDDMockito.given(studRepository!!.selectExistsEmail(stud.email))
            .willReturn(true)
        //when
        //then
        AssertionsForClassTypes.assertThatThrownBy { underTest!!.addStud(stud) }
            .isInstanceOf(BadRequestException::class.java)
            .hasMessageContaining("Email " + stud.email + " taken")
        Mockito.verify(studRepository, Mockito.never()).save(ArgumentMatchers.any())
    }

    @Test
    fun willThrowWhenIdDoesNotExist() {
        //given
        val notAStudId = 2
        BDDMockito.given(studRepository!!.existsById(notAStudId)).willReturn(false)
        //when
        //then
        AssertionsForClassTypes.assertThatThrownBy { underTest!!.deleteStud(notAStudId) }
            .isInstanceOf(StudentNotFoundException::class.java)
            .hasMessageContaining("Student with id $notAStudId does not exist")
        Mockito.verify(studRepository, Mockito.never()).deleteById(ArgumentMatchers.any())
    }

    @Test
    fun canDeleteStud() {
        //given
        val studId = 2
        BDDMockito.given(studRepository!!.existsById(studId)).willReturn(true)
        //when
        underTest!!.deleteStud(studId)
        //then
        Mockito.verify(studRepository).deleteById(studId)
    }
}