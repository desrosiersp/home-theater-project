import React from 'react';
import CommunityBuildsTab from './CommunityBuildsTab'; // It's in the same 'pages' directory
import { Typography, Box, Container } from '@mui/material';

const BuildBlogListPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Build Blogs & Community Showcases
        </Typography>
        <CommunityBuildsTab />
      </Box>
    </Container>
  );
};

export default BuildBlogListPage;
