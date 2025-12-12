import React, { useEffect, useState } from "react";
import postService from "@/appwrite/post";
import { Container, PostCard } from "@/Components";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";

function AllPosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  // const [posts, setPosts] = useState([]);
  useEffect(() => {
    postService.getPosts([]).then((posts) => {
      if (posts) {
        dispatch(setPosts({ posts: posts.rows }));
        // setPosts(posts.rows);
      }
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
