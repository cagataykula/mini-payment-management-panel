import DefaultLayout from '@/layouts/DefaultLayout';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [readmeContent, setReadmeContent] = useState('');
  const router = useRouter()

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await axios('/api/readme');
        const data = await response;
        setReadmeContent(data.data.content.replaceAll('<br>', '\n'));
      } catch (error) {
        console.error('Failed to fetch README content:', error);
      }
    };

    fetchReadme();
  }, []);

  return (
    <DefaultLayout title="Payments">
      <Box display="flex" justifyContent={{xs: 'center', md: 'flex-end'}}>
        <Button sx={{ position: { xs: 'block', md: 'absolute' }, marginTop: { xs: 0, md: '40px' }, marginRight: { xs: 0, md: '20px' } }} variant="outlined" onClick={() => router.push('/payments')}>Go to the Payments Page</Button>
      </Box>
      <Box className="markdown-body">
        <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
          {readmeContent}
        </Markdown>
      </Box>
    </DefaultLayout>
  )
}
