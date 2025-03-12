
import React, { useRef, useEffect } from 'react';
import { Comment } from '@/context/AppContext';

interface CommentAreaProps {
  comments: Comment[];
}

const CommentArea: React.FC<CommentAreaProps> = ({ comments }) => {
  const commentAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentAreaRef.current) {
      commentAreaRef.current.scrollTop = commentAreaRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div 
      ref={commentAreaRef}
      className="flex flex-col gap-2 w-full h-[300px] overflow-y-auto p-2 bg-black/20 rounded-md"
    >
      {comments.map((comment) => (
        <div key={comment.id} className={`flex flex-col ${comment.isSystem ? 'text-yellow-200' : 'text-white'}`}>
          {!comment.isSystem && <div className="font-bold">{comment.character}</div>}
          <div className="text-sm whitespace-pre-line">{comment.message}</div>
        </div>
      ))}
    </div>
  );
};

export default CommentArea;
