"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDetails } from '@/store/slices/data';
import Main from '../../main';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    if (postId) {
      dispatch(setDetails({ context: "post", id: postId }));
    }
  }, [dispatch, postId]);

  return <Main />;
}
