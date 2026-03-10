package com.fatec.todolist.exception;

import com.fatec.todolist.dto.ErroResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse recursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        return ErroResponse.criar(404, "RECURSO_NAO_ENCONTRADO", ex.getMessage(), null);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse argumentoInvalido(IllegalArgumentException ex) {
        return ErroResponse.criar(400, "ARGUMENTO_INVALIDO", ex.getMessage(), null);
    }
}
