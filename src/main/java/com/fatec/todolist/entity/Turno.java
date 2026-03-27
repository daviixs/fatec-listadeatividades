package com.fatec.todolist.entity;

public enum Turno {

    MANHA("Matutino"),
    NOITE("Noturno");

    private final String displayName;

    Turno(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
