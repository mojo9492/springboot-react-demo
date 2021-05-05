package com.boberlabs.amigoscode1.student

import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull


@Entity
data class Stud(
    @Id
    @SequenceGenerator(name = "stud_sequence", sequenceName = "stud_sequence", allocationSize = 1)
    @GeneratedValue(generator = "stud_sequence", strategy = GenerationType.SEQUENCE)
    val id: Int,
    @NotBlank
    @Column(nullable = false)
    val name: String,
    @Email
    @Column(nullable = false, unique = true)
    val email: String,
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val gender: Gender
)
