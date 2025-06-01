import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Paper, Box, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import ReactMarkdown from 'react-markdown';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Optional: for a back button

function HowToDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/assets/data/howTos.json') // We will create this JSON file
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const foundArticle = data.find(art => art.slug === slug);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!article) {
    return <Container sx={{ mt: 4 }}><Alert severity="info">Article not available.</Alert></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={RouterLink} to="/guides/how-to" sx={{ mb: 2 }}>
        {/* <ArrowBackIcon sx={{ mr: 1 }} /> */}
        Back to How-To Guides
      </Button>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
          By {article.author || 'Staff'} | Published: {new Date(article.datePublished).toLocaleDateString()}
        </Typography>
        {article.featuredImage && (
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <img src={article.featuredImage} alt={article.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
          </Box>
        )}
        <Box className="markdown-content" sx={{ mt: 3, '& p': { lineHeight: 1.7 }, '& h2': { mt: 4, mb: 2 }, '& h3': { mt: 3, mb: 1 } }}>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </Box>
      </Paper>

      {article.affiliateProducts && article.affiliateProducts.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Recommended Products
          </Typography>
          <Grid container spacing={3}>
            {article.affiliateProducts.map((product, index) => (
              <Grid xs={12} sm={6} md={4} key={index}> {/* Removed item prop, xs/sm/md are direct props */}
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {product.productImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.productImage}
                      alt={product.productName}
                      sx={{ objectFit: 'contain', p:1 }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.productName}
                    </Typography>
                    {product.description && (
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      component="a" 
                      href={product.affiliateLink} 
                      target="_blank" 
                      rel="noopener noreferrer sponsored" // 'sponsored' is good for affiliate links
                      fullWidth
                    >
                      Check Price
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default HowToDetailPage;
