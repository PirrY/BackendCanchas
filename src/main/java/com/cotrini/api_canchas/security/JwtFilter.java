package com.cotrini.api_canchas.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String correo = null;
        String jwt = null;

        // 1. Verificar si la petición trae el token en el formato correcto (Bearer ...)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Extraemos el token quitando la palabra "Bearer "
            try {
                correo = jwtUtil.extraerCorreo(jwt);
            } catch (Exception e) {
                System.out.println("Token inválido o expirado");
            }
        }

        // 2. Si hay un correo en el token y el usuario aún no está autenticado en el contexto actual
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(correo);

            // 3. Validar matemáticamente la firma y expiración del token
            if (jwtUtil.validarToken(jwt, userDetails.getUsername())) {
                // 4. "Loguear" al usuario en Spring Security para esta petición específica
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continuar con la petición hacia el controlador
        filterChain.doFilter(request, response);
    }
}
