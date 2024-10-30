"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails } from '@/store/slices/data';
import Main from '../../main';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/request';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function ChannelPage() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const channelName = decodeURIComponent(pathname.split('/').pop());

  const { data: channelData, error, isLoading } = useSWR(`topic/get?rtf=id,title`, fetcher);

  useEffect(() => {
    if (channelData && Array.isArray(channelData)) {
      const matchingChannel = channelData.find(channel => channel.title === channelName);
      if (matchingChannel) {
        dispatch(setDetails({ context: "topic", id: matchingChannel.id, title: matchingChannel.title }));
      }
    }
  }, [dispatch, channelName, channelData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const matchingChannel = channelData.find(channel => channel.title === channelName);

  if (!matchingChannel) {
    return <Typography>Channel not found</Typography>;
  }


  return <Main />;
}
