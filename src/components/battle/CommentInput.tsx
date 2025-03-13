
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

const CommentInput: React.FC = () => {
  const [comment, setComment] = useState('');
  const { addComment } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Use the specified listener name instead of player name
      addComment("巨万の富男＠怪しい者ですが誠実です", comment);
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
