package com.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public record FavouriteRequestDTO(Long userId, JsonNode fullData, Long id) {
    @JsonCreator
    public FavouriteRequestDTO(
            @JsonProperty("userId") Long userId,
            @JsonProperty("fullData") JsonNode fullData,
            @JsonProperty("gifId") Long id
    ) {
        this.userId = userId;
        this.fullData = fullData;
        this.id = id;
    }
}
