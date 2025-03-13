
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
      className="bg-black/50 rounded-md p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
    >
      <div className="flex flex-col gap-2">
        {comments.map((comment, index) => (
          <div key={index} className={`flex items-start gap-2 ${comment.isSystem ? 'text-yellow-300 bg-black/50 p-2 rounded' : 'text-white'}`}>
            {!comment.isSystem && (
              <>
                <img 
                  src={comment.author === "とおる＠経営参謀" ? "/lovable-uploads/a37987c5-d1ab-4f11-86a4-7ac9a089a401.png" : 
                       comment.author === "そーそー＠狂犬ツイート" ? "/lovable-uploads/5af802e0-9f63-462c-838c-e2b1acbf3c6f.png" : 
                       "/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png"}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full mt-1"
                />
                <div className="flex-1">
                  <span className="font-bold">{comment.author}</span>
                  <div className="bg-black p-2 rounded-md mt-1 mb-1">{comment.text}</div>
                </div>
              </>
            )}
            {comment.isSystem && (
              <span className="bg-black/50 w-full p-2 rounded">{comment.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentArea;
