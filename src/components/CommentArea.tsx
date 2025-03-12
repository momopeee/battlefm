
import React from 'react';
import { Comment } from '@/context/AppContext';

interface CommentAreaProps {
  comments: Comment[];
}

const CommentArea: React.FC<CommentAreaProps> = ({ comments }) => {
  return (
    <div className="bg-black/70 rounded-md p-4 h-56 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {comments.map((comment, index) => (
          <div key={index} className={`${comment.isSystem ? 'text-yellow-300' : 'text-white'}`}>
            {!comment.isSystem && <span className="font-bold">{comment.author}: </span>}
            <span>{comment.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentArea;
