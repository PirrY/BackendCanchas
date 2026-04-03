package com.cotrini.api_canchas.repositories;

import com.cotrini.api_canchas.entities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByDiaSemana(String diaSemana);
}
