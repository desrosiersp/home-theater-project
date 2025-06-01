import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalLayout from './components/Layout/GlobalLayout';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import HowToListPage from './pages/HowToListPage';
import HowToDetailPage from './pages/HowToDetailPage';
// Placeholder for future list and detail pages
// import ComparisonListPage from './pages/ComparisonListPage';
// import ComparisonDetailPage from './pages/ComparisonDetailPage';
// import BuyersGuideListPage from './pages/BuyersGuideListPage';
// import BuyersGuideDetailPage from './pages/BuyersGuideDetailPage';
// import BudgetBuildListPage from './pages/BudgetBuildListPage';
// import BudgetBuildDetailPage from './pages/BudgetBuildDetailPage';
// import TechDeepDiveListPage from './pages/TechDeepDiveListPage';
// import TechDeepDiveDetailPage from './pages/TechDeepDiveDetailPage';
// import ReviewListPage from './pages/ReviewListPage';
// import ReviewDetailPage from './pages/ReviewDetailPage';
import BuildBlogListPage from './pages/BuildBlogListPage'; // Use the new list page
// import BuildBlogDetailPage from './pages/BuildBlogDetailPage';
// import GlossaryPage from './pages/GlossaryPage'; // Keep GlossaryPage import commented

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          
          {/* Guides Routes - Redirect main /guides to /guides/how-to or a dedicated landing page */}
          <Route path="/guides" element={<Navigate replace to="/guides/how-to" />} /> {/* Or a GuidesLandingPage */}
          <Route path="/guides/how-to" element={<HowToListPage />} />
          <Route path="/guides/how-to/:slug" element={<HowToDetailPage />} />
          
          <Route path="/build-blogs" element={<BuildBlogListPage />} /> 
          {/* 
            The following routes are placeholders for future development:
          <Route path="/guides/comparisons" element={<ComparisonListPage />} />
          <Route path="/guides/comparisons/:slug" element={<ComparisonDetailPage />} />
          <Route path="/guides/buyers-guides" element={<BuyersGuideListPage />} />
          <Route path="/guides/buyers-guides/:slug" element={<BuyersGuideDetailPage />} />
          <Route path="/guides/budget-builds" element={<BudgetBuildListPage />} />
          <Route path="/guides/budget-builds/:slug" element={<BudgetBuildDetailPage />} />
          <Route path="/guides/tech-deep-dives" element={<TechDeepDiveListPage />} />
          <Route path="/guides/tech-deep-dives/:slug" element={<TechDeepDiveDetailPage />} />

          <Route path="/reviews" element={<ReviewListPage />} />
          <Route path="/reviews/:slug" element={<ReviewDetailPage />} />

          <Route path="/build-blogs/:slug" element={<BuildBlogDetailPage />} />

          <Route path="/learn" element={<Navigate replace to="/learn/glossary" />} />
          <Route path="/learn/glossary" element={<GlossaryPage />} />
          */}

          {/* Placeholder for unmatched routes (404 page) */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
