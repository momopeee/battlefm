
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the start screen
    navigate('/start');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>ゲームを開始しています...</p>
    </div>
  );
};

export default Index;
