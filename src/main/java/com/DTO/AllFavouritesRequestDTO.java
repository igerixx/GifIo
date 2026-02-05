package com.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AllFavouritesRequestDTO(Long userId) {
    @JsonCreator
    public AllFavouritesRequestDTO(
            @JsonProperty("userId") Long userId
    ) {
        this.userId = userId;
    }
}
