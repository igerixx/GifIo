package com.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record TrendingRequestDTO(boolean isReloadedPage) {
    @JsonCreator
    public TrendingRequestDTO(
            @JsonProperty("isReloadedPage") boolean isReloadedPage
    ) {
        this.isReloadedPage = isReloadedPage;
    }
}
