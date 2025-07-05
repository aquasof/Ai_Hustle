package com.record.bookshop;


import com.record.bookshop.model.Book;
import com.record.bookshop.repository.BookRepository;
import com.record.bookshop.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public Book updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id).map(book -> {
//            book.setTitle(updatedBook.getTitle());
//            book.setAuthor(updatedBook.getAuthor());
//            book.setIsbn(updatedBook.getIsbn());
//            book.setPrice(updatedBook.getPrice());
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);

    }
}

