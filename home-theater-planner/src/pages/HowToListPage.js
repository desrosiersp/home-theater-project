import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, CircularProgress, Alert } from '@mui/material';
import ArticleCard from '../components/Articles/ArticleCard';

function HowToListPage() {
  const [articles, setArticles] = useState([]);
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
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">Error loading articles: {error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        How-To Guides
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Explore our collection of helpful guides to get the most out of your home theater.
      </Typography>
      {articles.length === 0 ? (
        <Typography variant="body1" align="center">No guides available yet. Check back soon!</Typography>
      ) : (
        <Grid container spacing={4}>
          {articles.map(article => (
            <Grid key={article.id} xs={12} sm={6} md={4}> {/* Removed item prop, xs/sm/md are direct props */}
              <ArticleCard article={article} basePath="/guides/how-to" />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default HowToListPage;
