"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDetails } from '@/store/slices/data';
import Main from '../../main';
import { useParams } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import useSWR from 'swr';
import { fetcher } from '@/lib/request';

export default function ChannelPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const channelName = params.name;

  const { data: channelData, error } = useSWR(`topic/get`, fetcher);

  useEffect(() => {
    if (channelData) {
      const channel = channelData.find(topic => topic.name === channelName);
      if (channel) {
        dispatch(setDetails({ context: "topic", id: channel.id, title: channel.name }));
      }
    }
  }, [dispatch, channelName, channelData]);

  if (error) {
    return <Typography color="error">Error loading channel data</Typography>;
  }

  if (!channelData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Main />;
}
