package com.Repository;

import com.Entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavRepository extends JpaRepository<Favourite, Long> {
    @Query("SELECT f.fullData FROM Favourite f WHERE f.id = :userId")
    List<String> findFullDataByUserId(@Param("userId") Long userId);
    List<Favourite> findAllByUserId(Long userId);
}
