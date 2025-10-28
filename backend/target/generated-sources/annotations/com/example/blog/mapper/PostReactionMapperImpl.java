package com.example.blog.mapper;

import com.example.blog.dto.response.PostReactionResponse;
import com.example.blog.entity.Post;
import com.example.blog.entity.PostReaction;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-28T18:27:09+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class PostReactionMapperImpl implements PostReactionMapper {

    private final UserMapper userMapper = UserMapper.INSTANCE;

    @Override
    public PostReactionResponse toPostReactionResponse(PostReaction postReaction) {
        if ( postReaction == null ) {
            return null;
        }

        PostReactionResponse.PostReactionResponseBuilder postReactionResponse = PostReactionResponse.builder();

        postReactionResponse.postId( postReactionPostId( postReaction ) );
        postReactionResponse.type( postReaction.getType() );
        postReactionResponse.user( userMapper.userToUserResponse( postReaction.getUser() ) );

        return postReactionResponse.build();
    }

    private String postReactionPostId(PostReaction postReaction) {
        Post post = postReaction.getPost();
        if ( post == null ) {
            return null;
        }
        return post.getId();
    }
}
