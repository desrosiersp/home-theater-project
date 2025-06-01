import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ArticleCard({ article, basePath }) {
  const placeholderImage = '/assets/images/placeholder-build-default.jpg'; // Assuming this exists or will be created

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`${basePath}/${article.slug}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="160"
          image={article.featuredImage || placeholderImage}
          alt={article.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h3">
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {new Date(article.datePublished).toLocaleDateString()}
            {article.author && ` - By ${article.author}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3, // Show 3 lines of summary
            WebkitBoxOrient: 'vertical',
          }}>
            {article.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0 }}> 
        <RouterLink to={`${basePath}/${article.slug}`} style={{ textDecoration: 'none' }}>
          <Typography color="primary">Read More</Typography>
        </RouterLink>
      </Box>
    </Card>
  );
}

export default ArticleCard;
