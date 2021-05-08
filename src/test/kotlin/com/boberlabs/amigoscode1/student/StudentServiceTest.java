package com.boberlabs.amigoscode1.student;

import com.boberlabs.amigoscode1.student.exception.BadRequestException;
import com.boberlabs.amigoscode1.student.exception.StudentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    //Mock the repository
    @Mock
    private StudentRepository studentRepository;
    private StudentService underTest;

    @BeforeEach
    void setUp() {
        underTest = new StudentService(studentRepository);
    }

    @Test
    void canGetAllStudents() {
        //when
        underTest.getAllStudents();
        //then
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        //given
        Student student = new Student(
                "Jobi",
                "jobi@boberlabs.com",
                Gender.MALE
        );
        //when
        underTest.addStudent(student);
        //then
        ArgumentCaptor<Student> studentArgumentCaptor =
                ArgumentCaptor.forClass(Student.class);

        verify(studentRepository).save(studentArgumentCaptor.capture());
        Student capturedStudent = studentArgumentCaptor.getValue();
        assertThat(capturedStudent).isEqualTo(student);
    }

    @Test
    void willThrowWhenEmailIsTaken() {
        //given
        Student student = new Student(
                "Jobi",
                "jobi@boberlabs.com",
                Gender.MALE
        );

        given(studentRepository.selectExistsEmail(student.getEmail()))
                .willReturn(true);
        //when
        //then
        assertThatThrownBy(() -> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() + " taken");

        verify(studentRepository, never()).save(any());
    }

    @Test
    void willThrowWhenIdDoesNotExist() {
        //given
        Long notAStudentId = 2L;
        given(studentRepository.existsById(notAStudentId)).willReturn(false);
        //when
        //then
        assertThatThrownBy(() -> underTest.deleteStudent(notAStudentId))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id " + notAStudentId + " does not exist");

        verify(studentRepository, never()).deleteById(any());
    }

    @Test
    void canDeleteStudent() {
        //given
        Long studentId = 2L;
        given(studentRepository.existsById(studentId)).willReturn(true);
        //when
        underTest.deleteStudent(studentId);
        //then
        verify(studentRepository).deleteById(studentId);
    }
}