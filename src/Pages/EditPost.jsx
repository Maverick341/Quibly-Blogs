import React, { useEffect, useState } from "react";
import { Container, PostForm } from "@/Components";
import postService from "@/appwrite/post";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPost } from "@/store/postSlice";
import { parseSlugId } from "@/utils/parseSlugId";

function EditPost() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.currentPost);

  //  const [post, setPost] = useState(null);
  const { slug: slugParam } = useParams();
  const { slug, id } = parseSlugId(slugParam);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug && id) {
      postService.getPost(id).then((post) => {
        if (post) {
          dispatch(setCurrentPost({ post }));
          //  setPost(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [id, navigate]);
  return post ? (
    <Container>
      <PostForm post={post} />
    </Container>
  ) : null;
}

export default EditPost;
