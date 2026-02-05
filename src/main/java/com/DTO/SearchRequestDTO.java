package com.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SearchRequestDTO(String request) {
    @JsonCreator
    public SearchRequestDTO(
            @JsonProperty("request") String request
    ) {
        this.request = request;
    }
}
