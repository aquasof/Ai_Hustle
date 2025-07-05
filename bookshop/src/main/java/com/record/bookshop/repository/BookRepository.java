package com.record.bookshop.repository;


import com.record.bookshop.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // You can define custom query methods later if needed


    List<Book> findByAuthor(String author);

}

