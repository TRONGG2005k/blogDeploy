package com.example.blog.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;



@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {
    String id;
    String name;
}
