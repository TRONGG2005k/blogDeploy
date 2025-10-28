package com.example.blog.mapper;

import com.example.blog.dto.response.CommentResponse;
import com.example.blog.entity.Comment;
import com.example.blog.entity.Post;
import com.example.blog.entity.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-28T18:27:09+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class CommentMapperImpl implements CommentMapper {

    @Override
    public CommentResponse toResponse(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentResponse.CommentResponseBuilder commentResponse = CommentResponse.builder();

        commentResponse.username( commentUserUsername( comment ) );
        commentResponse.userId( commentUserId( comment ) );
        commentResponse.postId( commentPostId( comment ) );
        commentResponse.parentCommentId( commentParentId( comment ) );
        commentResponse.content( comment.getContent() );
        commentResponse.createdAt( comment.getCreatedAt() );
        commentResponse.id( comment.getId() );
        commentResponse.updatedAt( comment.getUpdatedAt() );

        commentResponse.reactionCount( comment.getReactions() != null ? comment.getReactions().size() : 0 );

        return commentResponse.build();
    }

    @Override
    public List<CommentResponse> toResponseList(List<Comment> comments) {
        if ( comments == null ) {
            return null;
        }

        List<CommentResponse> list = new ArrayList<CommentResponse>( comments.size() );
        for ( Comment comment : comments ) {
            list.add( toResponse( comment ) );
        }

        return list;
    }

    private String commentUserUsername(Comment comment) {
        User user = comment.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getUsername();
    }

    private String commentUserId(Comment comment) {
        User user = comment.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }

    private String commentPostId(Comment comment) {
        Post post = comment.getPost();
        if ( post == null ) {
            return null;
        }
        return post.getId();
    }

    private String commentParentId(Comment comment) {
        Comment parent = comment.getParent();
        if ( parent == null ) {
            return null;
        }
        return parent.getId();
    }
}
