
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black p-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">ファンキーバトルアドベンチャー</h1>
        
        <p className="text-xl text-white/90 mb-8">
          ファンキーな世の中でのあなたの冒険が、今始まります。
          選択次第で運命が変わる、インタラクティブな物語の世界へようこそ。
        </p>
        
        <div className="space-y-4">
          <Button 
            asChild
            className="w-full md:w-64 text-lg py-6 bg-purple-600 hover:bg-purple-700"
          >
            <Link to="/start">ストーリーを始める</Link>
          </Button>
          
          <div className="mt-6 text-white/70 text-sm">
            © 2024 ファンキーバトルアドベンチャー
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
