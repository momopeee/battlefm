
import React, { useEffect, useRef } from 'react';
import { Comment } from '@/context/AppContext';

interface CommentAreaProps {
  comments: Comment[];
}

const CommentArea: React.FC<CommentAreaProps> = ({ comments }) => {
  const commentAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new comments
  useEffect(() => {
    if (commentAreaRef.current) {
      commentAreaRef.current.scrollTop = commentAreaRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div 
      ref={commentAreaRef}
      className="bg-black/70 rounded-md p-4 h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
    >
      <div className="flex flex-col gap-2">
        {comments.map((comment, index) => (
          <div key={index} className={`flex items-start gap-2 ${comment.isSystem ? 'text-yellow-300' : 'text-white'}`}>
            {!comment.isSystem && (
              <>
                <img 
                  src={comment.author === "とおる＠経営参謀" ? "/lovable-uploads/a37987c5-d1ab-4f11-86a4-7ac9a089a401.png" : 
                       comment.author === "そーそー＠狂犬ツイート" ? "/lovable-uploads/5af802e0-9f63-462c-838c-e2b1acbf3c6f.png" : 
                       "/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png"}
                  alt={comment.author}
                  className="w-6 h-6 rounded-full mt-1"
                />
                <div>
                  <span className="font-bold">{comment.author}: </span>
                  <span>{comment.text}</span>
                </div>
              </>
            )}
            {comment.isSystem && (
              <span>{comment.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentArea;
