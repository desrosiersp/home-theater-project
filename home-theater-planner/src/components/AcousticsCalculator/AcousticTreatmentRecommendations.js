import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AcousticTreatmentRecommendations = () => {
  // In a more advanced version, these recommendations could be dynamically generated
  // based on room modes, FRP data, selected components, etc.
  // For now, these are general best-practice recommendations.

  const recommendations = [
    {
      title: "First Reflection Points (FRPs)",
      icon: <CheckCircleOutlineIcon color="primary" />,
      points: [
        "Treating FRPs is crucial for clarity, imaging, and reducing comb filtering.",
        "Use broadband absorption panels (e.g., 2-4 inches thick mineral wool or fiberglass) at side wall FRPs for front L/R speakers.",
        "Consider absorption or diffusion at the ceiling FRP.",
        "A thick rug on the floor can help with floor bounce FRPs.",
      ]
    },
    {
      title: "Low-Frequency Management (Bass Traps)",
      icon: <ReportProblemOutlinedIcon color="error" />,
      points: [
        "Room modes cause uneven bass (boomy spots, nulls). Bass traps are essential for smoother low-frequency response.",
        "Place porous absorber bass traps (thick fiberglass/mineral wool panels) in as many room corners as possible (wall-wall and wall-ceiling corners).",
        "For very low frequencies or specific problematic modes, consider tuned membrane traps or Helmholtz resonators (more advanced).",
        "Multiple subwoofers, strategically placed, can also help mitigate modal issues.",
      ]
    },
    {
      title: "Rear Wall Treatment",
      icon: <InfoOutlinedIcon color="action" />,
      points: [
        "The wall behind the listening position can cause strong reflections.",
        "Consider a combination of absorption and diffusion on the rear wall.",
        "Thicker absorption or diffusion is generally better for the rear wall, especially if the listening position is close to it.",
      ]
    },
    {
      title: "General Advice",
      icon: <InfoOutlinedIcon color="action" />,
      points: [
        "Start with treating FRPs and corners, then assess.",
        "Don't make the room too 'dead' by over-absorbing high frequencies. A balance of absorption and diffusion is often ideal.",
        "Acoustic measurements (e.g., with a calibrated microphone and software like REW) are highly recommended for identifying specific issues and verifying treatment effectiveness.",
        "These are general guidelines. Optimal treatment depends on your specific room, speakers, and listening preferences.",
      ]
    }
  ];

  return (
    <Box sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Acoustic Treatment Recommendations
      </Typography>
      {recommendations.map((rec, index) => (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }} key={index}>
          <Box display="flex" alignItems="center" mb={1}>
            {rec.icon}
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              {rec.title}
            </Typography>
          </Box>
          <List dense>
            {rec.points.map((point, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={point} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default AcousticTreatmentRecommendations;
