package com.arabic.vocabulary.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vocabulary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String arabicWord;

    private String transliteration;

    @Column(nullable = false)
    private String meaning;

    private String example;

    private String imageUrl; // simpan link gambar

    private String category;
}
