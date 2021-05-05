package com.boberlabs.amigoscode1.student

import lombok.AllArgsConstructor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController //exposes endpoints for the client
@RequestMapping("api/v1/studs") // the url path
@AllArgsConstructor
class StudController {
    @Autowired
    lateinit var studService: StudService

    @GetMapping
    fun getAllStuds(): List<Stud> {
        return studService.getAllStuds()
    }

    @PostMapping
    fun addStud(@Valid @RequestBody stud: Stud) {
        studService.addStud(stud)
    }

    @DeleteMapping(path = ["{studentId}"])
    //Check if student exists
    fun deleteStudent(
        @PathVariable("studentId") studId: Int
    ) {
        studService.deleteStud(studId)
    }
}



