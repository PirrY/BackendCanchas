package com.cotrini.api_canchas.security;

import com.cotrini.api_canchas.entities.Usuario;
import com.cotrini.api_canchas.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));

        // Retornamos un User de Spring Security.
        // Como todos los usuarios registrados tienen el mismo nivel de acceso[cite: 21], enviamos una lista vacía de roles (ArrayList).
        return new User(usuario.getCorreo(), usuario.getPassword(), new ArrayList<>());
    }
}
