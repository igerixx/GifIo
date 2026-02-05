package com.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record CheckGifInDBRequestDTO(Long id, Long userId) {
    @JsonCreator
    public CheckGifInDBRequestDTO(
        @JsonProperty("gifId") Long id,
        @JsonProperty("userId") Long userId
    ) {
        this.id = id;
        this.userId = userId;
    }
}
