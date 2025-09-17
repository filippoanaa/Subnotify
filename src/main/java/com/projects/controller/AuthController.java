package com.projects.controller;

import com.projects.config.JWTUtil;
import com.projects.exception.EntityAlreadyExistsException;
import com.projects.exception.EntityNotFoundException;
import com.projects.exception.ValidationException;
import com.projects.model.dto.LoginRequest;
import com.projects.model.dto.LoginResponse;
import com.projects.model.dto.RegisterRequest;
import com.projects.model.entity.AppUser;
import com.projects.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserService appUserService;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    public AuthController(AppUserService appUserService, JWTUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.appUserService = appUserService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest ) {
        try {
            System.out.println("Pass: " + registerRequest.getPassword() + " pass confirm " + registerRequest.getPasswordConfirmation());
            return ResponseEntity.ok(appUserService.createAppUser(registerRequest));
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest ) {
        try{
            AppUser appUser = appUserService.findByEmail(loginRequest.getEmail());

            if(!passwordEncoder.matches(loginRequest.getPassword(), appUser.getPassword())){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }

            String token = jwtUtil.generateToken(appUser);
            return ResponseEntity.ok(new LoginResponse(token));
        }catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
