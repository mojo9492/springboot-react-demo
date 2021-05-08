package com.boberlabs.amigoscode1.student

import com.boberlabs.amigoscode1.student.exception.BadRequestException
import com.boberlabs.amigoscode1.student.exception.StudNotFoundException
import lombok.AllArgsConstructor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@AllArgsConstructor
@Service
class StudService(studRepository: StudRepository) {
    @Autowired
    lateinit var studRepository: StudRepository

    fun getAllStuds(): List<Stud> {
        return studRepository.findAll()
    }

    fun addStud(stud: Stud) {
        val existsEmail = studRepository.selectExistsEmail(stud.email)
        if (existsEmail) throw BadRequestException("$stud.email is taken") else studRepository.save(stud)
    }

    fun deleteStud(studId: Int) {
        //check if student exists
        if (!studRepository.existsById(studId)) {
            throw StudNotFoundException("Student with id $studId does not exist")
        }
        //delete stud by ID
        studRepository.deleteById(studId)
    }
}
