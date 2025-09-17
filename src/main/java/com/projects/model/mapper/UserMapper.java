package com.projects.model.mapper;

import com.projects.model.dto.RegisterRequest;
import com.projects.model.entity.AppUser;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface UserMapper {
    public AppUser toEntity(RegisterRequest registerRequest) ;
}
