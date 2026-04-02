package com.cotrini.api_canchas.services;

import com.cotrini.api_canchas.dto.RegistroRequestDTO;
import com.cotrini.api_canchas.entities.Usuario;
import com.cotrini.api_canchas.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public void registrarUsuario(RegistroRequestDTO request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya esta registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setCorreo(request.getCorreo());
        nuevoUsuario.setPassword(request.getPassword());

        usuarioRepository.save(nuevoUsuario);
    }
}
