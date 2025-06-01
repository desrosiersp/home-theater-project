import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import CommunityBuildCard from '../components/Community/CommunityBuildCard';
// import { useStorageContext } from '../context/StorageContext'; // Removed

const CommunityBuildsTab = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { loadDesign } = useStorageContext(); // Removed

  useEffect(() => {
    fetch('/assets/data/communityBuilds.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBuilds(data.builds || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching community builds:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // const handleLoadBuild = (buildId) => { ... }; // Removed function

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">Failed to load community builds: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Community Theater Builds
      </Typography>
      {builds.length === 0 && !loading && (
        <Typography>No community builds available at the moment.</Typography>
      )}
      <Grid container spacing={3}>
        {builds.map((build) => (
          <Grid item xs={12} sm={6} md={4} key={build.id}>
            <CommunityBuildCard build={build} /> {/* Removed onLoadBuild prop */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommunityBuildsTab;
