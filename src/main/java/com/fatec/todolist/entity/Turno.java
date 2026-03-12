package com.fatec.todolist.entity;

public enum Turno {

    MANHA("Manhã"),
    NOITE("Noite");

    private final String displayName;

    Turno(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
