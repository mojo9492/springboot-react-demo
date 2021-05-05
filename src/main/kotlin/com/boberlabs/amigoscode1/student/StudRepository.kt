package com.boberlabs.amigoscode1.student

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query


interface StudRepository : JpaRepository<Stud, Int> {
    @Query(
        "" +
                "SELECT CASE WHEN COUNT(s) > 0 THEN " +
                "TRUE ELSE FALSE END " +
                "FROM Stud s " +
                "WHERE s.email = ?1"
    )
    fun selectExistsEmail(email: String?): Boolean

}

