package com.example.blog.mapper;

import com.example.blog.dto.request.CreateUserRequest;
import com.example.blog.dto.request.UpdateUserRequest;
import com.example.blog.dto.response.RoleResponse;
import com.example.blog.dto.response.UserResponse;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-28T18:27:10+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse userToUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.active( user.getActive() );
        userResponse.email( user.getEmail() );
        userResponse.id( user.getId() );
        userResponse.roles( roleSetToRoleResponseSet( user.getRoles() ) );
        userResponse.username( user.getUsername() );

        return userResponse.build();
    }

    @Override
    public User createUserRequestToUser(CreateUserRequest user) {
        if ( user == null ) {
            return null;
        }

        User.UserBuilder user1 = User.builder();

        user1.email( user.getEmail() );
        user1.password( user.getPassword() );
        user1.username( user.getUsername() );

        return user1.build();
    }

    @Override
    public void updateUserRequestToUser(UpdateUserRequest request, User user) {
        if ( request == null ) {
            return;
        }

        user.setEmail( request.getEmail() );
        user.setPassword( request.getPassword() );
        user.setUsername( request.getUsername() );
    }

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.id( role.getId() );
        roleResponse.name( role.getName() );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
