"use client";
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { SkeletonPage } from './Skeleton';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <SkeletonPage dark={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
