
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

const CommentInput: React.FC = () => {
  const [comment, setComment] = useState('');
  const { addComment, player, setPlayer } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Use the specified listener name
      addComment("巨万の富男", comment, false);
      
      // Calculate HP recovery based on comment length
      // Longer comments recover more HP, with a min of 1 and max of 15
      const recoveryAmount = Math.min(Math.max(Math.floor(comment.length / 5), 1), 15);
      
      // Only recover if player HP isn't already at max
      if (player.currentHp < player.maxHp) {
        // Calculate new HP but don't exceed max HP
        const newHp = Math.min(player.currentHp + recoveryAmount, player.maxHp);
        
        // Update player HP
        setPlayer({
          ...player,
          currentHp: newHp
        });
        
        // Add system message about HP recovery
        addComment("システム", `リスナーの応援でとおるの体力が${recoveryAmount}回復した！`, true);
      }
      
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="コメント"
        className="flex-1 bg-gray-200 text-black rounded-md px-4 py-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="bg-pink-500 text-white rounded-md px-4 py-2 hover:bg-pink-600 transition-colors"
        disabled={!comment.trim()}
      >
        送信
      </button>
    </form>
  );
};

export default CommentInput;
