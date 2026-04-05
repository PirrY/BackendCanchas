package com.cotrini.api_canchas.repositories;

import com.cotrini.api_canchas.entities.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {
    List<Cancha> findBySedeId(Long sedeId);
    List<Cancha> findByTipoCanchaId(Long tipoCanchaId);
    List<Cancha> findBySedeIdAndTipoCanchaId(Long sedeId, Long tipoCanchaId);
}
