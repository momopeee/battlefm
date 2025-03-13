
import React from 'react';

const CommentInput: React.FC = () => {
  return (
    <div className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="コメント"
        className="flex-1 bg-gray-200 text-black rounded-md px-4 py-2"
        disabled
      />
      <button
        className="bg-pink-500 text-white rounded-md px-4 py-2"
        disabled
      >
        送信
      </button>
    </div>
  );
};

export default CommentInput;
