import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia, Chip, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// Placeholder image if actual imageUrl is missing or fails to load
const placeholderImg = "/assets/images/placeholder-build-default.jpg"; // Ensure this exists or use a more generic one

const CommunityBuildCard = ({ build }) => { // Removed onLoadBuild from props
  const {
    title,
    author,
    description,
    speakerConfig,
    roomDimensions,
    unit,
    mainSpeakers,
    receiver,
    display,
    budgetTier,
    votes,
    imageUrl,
    id
  } = build;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl || placeholderImg} // Fallback to placeholder
        alt={`${title} image`}
        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }} // Handle broken image links
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          By: {author}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Chip label={`Config: ${speakerConfig}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        <Chip label={`Room: ${roomDimensions.width}x${roomDimensions.length}x${roomDimensions.height} ${unit === 'meters' ? 'm' : 'ft'}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        <Chip label={`Budget: ${budgetTier}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        <Box display="flex" alignItems="center" mt={1}>
          <StarIcon fontSize="small" sx={{ color: 'goldenrod', mr: 0.5 }} />
          <Typography variant="body2">{votes} votes</Typography>
        </Box>
      </CardContent>
      {/* <CardActions sx={{ justifyContent: 'center', pb:2 }}>
        <Button size="small" variant="contained" onClick={() => console.log("View details for build:", id)}>
          View Details
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default CommunityBuildCard;
