package com.example.blog.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    String  id;

    String username;

    String email;

    Boolean active;

    @Builder.Default
    Set<RoleResponse> roles = new HashSet<>();
}
