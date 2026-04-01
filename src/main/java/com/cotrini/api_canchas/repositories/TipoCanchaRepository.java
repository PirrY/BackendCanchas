package com.cotrini.api_canchas.repositories;

import com.cotrini.api_canchas.entities.TipoCancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoCanchaRepository extends JpaRepository<TipoCancha, Long> {
}
