"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDetails } from '@/store/slices/data';
import Profile from '../../profile';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const params = useParams();
  const username = params.username;

  useEffect(() => {
    dispatch(setDetails({ context: "profile", username }));
  }, [dispatch, username]);

  return <Profile username={username} />;
}
