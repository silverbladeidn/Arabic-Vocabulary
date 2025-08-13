package com.arabic.vocabulary.controller;

import com.arabic.vocabulary.model.Vocabulary;
import com.arabic.vocabulary.repository.VocabularyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/vocabulary")
@CrossOrigin(origins = "*")
public class VocabularyController {

    private final VocabularyRepository repository;

    public VocabularyController(VocabularyRepository repository) {
        this.repository = repository;
    }

    // GET semua vocabulary
    @GetMapping
    public ResponseEntity<List<Vocabulary>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // GET vocabulary by id
    @GetMapping("/{id}")
    public ResponseEntity<Vocabulary> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST tambah satu vocabulary
    @PostMapping
    public ResponseEntity<Vocabulary> create(@RequestBody Vocabulary vocab) {
        Vocabulary saved = repository.save(vocab);
        return ResponseEntity.ok(saved);
    }

    // POST tambah banyak vocabulary
    @PostMapping("/list")
    public ResponseEntity<List<Vocabulary>> createMany(@RequestBody List<Vocabulary> vocabList) {
        List<Vocabulary> savedList = repository.saveAll(vocabList);
        return ResponseEntity.ok(savedList);
    }

    // PUT update vocabulary
    @PutMapping("/{id}")
    public ResponseEntity<Vocabulary> update(@PathVariable Long id, @RequestBody Vocabulary newVocab) {
        return repository.findById(id)
                .map(existing -> {
                    copyNonNullProperties(newVocab, existing);
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE vocabulary
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // helper untuk update tanpa overwrite field null
    private void copyNonNullProperties(Vocabulary source, Vocabulary target) {
        if (source.getArabicWord() != null)
            target.setArabicWord(source.getArabicWord());
        if (source.getTransliteration() != null)
            target.setTransliteration(source.getTransliteration());
        if (source.getMeaning() != null)
            target.setMeaning(source.getMeaning());
        if (source.getExample() != null)
            target.setExample(source.getExample());
        if (source.getImageUrl() != null)
            target.setImageUrl(source.getImageUrl());
        if (source.getCategory() != null)
            target.setCategory(source.getCategory());
    }
}