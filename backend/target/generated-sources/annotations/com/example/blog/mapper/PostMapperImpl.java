package com.example.blog.mapper;

import com.example.blog.dto.response.PostResponse;
import com.example.blog.entity.Post;
import com.example.blog.entity.Tag;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-28T08:42:38+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class PostMapperImpl implements PostMapper {

    private final UserMapper userMapper = UserMapper.INSTANCE;
    private final CommentMapper commentMapper = CommentMapper.INSTANCE;

    @Override
    public PostResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( post.getId() );
        postResponse.caption( post.getCaption() );
        postResponse.user( userMapper.userToUserResponse( post.getUser() ) );
        postResponse.comments( commentMapper.toResponseList( post.getComments() ) );
        Set<Tag> set = post.getTags();
        if ( set != null ) {
            postResponse.tags( new LinkedHashSet<Tag>( set ) );
        }
        postResponse.createdAt( post.getCreatedAt() );

        postResponse.mediaUrls( mapMediaUrls(post) );

        return postResponse.build();
    }

    @Override
    public List<PostResponse> toPostResponseList(List<Post> posts) {
        if ( posts == null ) {
            return null;
        }

        List<PostResponse> list = new ArrayList<PostResponse>( posts.size() );
        for ( Post post : posts ) {
            list.add( toPostResponse( post ) );
        }

        return list;
    }
}
