import React, { useEffect, useState } from "react";
import { Container, PostForm } from "@/Components";
import postService from "@/appwrite/post";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPost } from "@/store/postSlice";

function EditPost() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.currentPost);

  //  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      postService.getPost(slug).then((post) => {
        if (post) {
          dispatch(setCurrentPost({ post }));
          //  setPost(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
