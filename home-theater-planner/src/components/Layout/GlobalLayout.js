import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // For mobile menu
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Planner', path: '/planner' },
  {
    label: 'Guides',
    path: '/guides',
    subItems: [
      { label: 'How-To\'s', path: '/guides/how-to' },
      { label: 'Comparisons', path: '/guides/comparisons' },
      { label: 'Buyer\'s Guides', path: '/guides/buyers-guides' },
      { label: 'Budget Builds', path: '/guides/budget-builds' },
      { label: 'Tech Deep Dives', path: '/guides/tech-deep-dives' },
    ]
  },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Build Blogs', path: '/build-blogs' },
  {
    label: 'Learn',
    path: '/learn',
    subItems: [
      { label: 'Glossary', path: '/learn/glossary' },
    ]
  },
];

function GlobalLayout() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElGuides, setAnchorElGuides] = React.useState(null);
  const [anchorElLearn, setAnchorElLearn] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenGuidesMenu = (event) => {
    setAnchorElGuides(event.currentTarget);
  };
  const handleCloseGuidesMenu = () => {
    setAnchorElGuides(null);
  };

  const handleOpenLearnMenu = (event) => {
    setAnchorElLearn(event.currentTarget);
  };
  const handleCloseLearnMenu = () => {
    setAnchorElLearn(null);
  };

  const renderNavItem = (item, closeMenu) => (
    <Button
      key={item.label}
      component={RouterLink}
      to={item.path}
      sx={{ color: 'white', display: 'block', mx: 1 }}
      onClick={closeMenu}
    >
      {item.label}
    </Button>
  );

  const renderSubMenu = (parentItem, anchorEl, openHandler, closeHandler) => (
    <Box key={parentItem.label}>
      <Button
        aria-controls={`menu-${parentItem.label.toLowerCase()}`}
        aria-haspopup="true"
        onClick={openHandler}
        sx={{ color: 'white', mx: 1 }}
        endIcon={<ArrowDropDownIcon />}
      >
        {parentItem.label}
      </Button>
      <Menu
        id={`menu-${parentItem.label.toLowerCase()}`}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={closeHandler}
      >
        {parentItem.subItems.map((subItem) => (
          <MenuItem key={subItem.label} component={RouterLink} to={subItem.path} onClick={closeHandler}>
            {subItem.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HT PLANNER
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {navItems.map((item) => (
                  item.subItems ? (
                    // Basic mobile submenu - could be improved with nested menus if MUI supports easily
                    [
                      <MenuItem key={item.label} onClick={handleCloseNavMenu} component={RouterLink} to={item.path}>
                        <Typography textAlign="center">{item.label} (Main)</Typography>
                      </MenuItem>,
                      ...item.subItems.map(subItem => (
                        <MenuItem key={subItem.label} onClick={handleCloseNavMenu} component={RouterLink} to={subItem.path} sx={{ pl: 4 }}>
                          <Typography textAlign="center">{subItem.label}</Typography>
                        </MenuItem>
                      ))
                    ]
                  ) : (
                    <MenuItem key={item.label} onClick={handleCloseNavMenu} component={RouterLink} to={item.path}>
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  )
                ))}
              </Menu>
            </Box>

            {/* Desktop Title (when mobile menu is shown) */}
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HT PLANNER
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              {navItems.map((item) =>
                item.subItems
                  ? item.label === 'Guides'
                    ? renderSubMenu(item, anchorElGuides, handleOpenGuidesMenu, handleCloseGuidesMenu)
                    : item.label === 'Learn'
                      ? renderSubMenu(item, anchorElLearn, handleOpenLearnMenu, handleCloseLearnMenu)
                      : renderNavItem(item, handleCloseNavMenu) // Fallback for other potential top-level items with subItems
                  : renderNavItem(item, handleCloseNavMenu)
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxWidth: false, mt: 2, mb: 2 }}>
        <Outlet /> {/* This is where the routed page components will be rendered */}
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Home Theater Planner. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default GlobalLayout;
