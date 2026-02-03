import React, { useState } from "react";
import Markdown from 'react-markdown'
const CreationsItems = ({ item }) => {

    const[expanded, SetExpanded] =useState(false);
  return (
    <div onClick={()=>SetExpanded(!expanded)}
      className="
        p-4 w-full
        text-sm
        bg-white
        border border-gray-200
        rounded-lg
        cursor-pointer
        hover:shadow-md
        hover:border-gray-300
        transition-all
      "
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium text-gray-800">
            {item.prompt}
          </h2>

          <p className="text-gray-500 text-xs mt-1">
            {item.type} ·{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          className="
            bg-[#EFF6FF]
            border border-[#BFDBFE]
            text-[#1E40AF]
            px-4 py-1
            rounded-full
            text-xs
            whitespace-nowrap
          "
        >
          {item.type}
        </button>
      </div>
      {
        expanded && (
            <div>
                {item.type==='image' ? (
                    <div>
                        <img src={item.content} alt="image" className="mt-3 w-full max-w-md" />
                    </div>
                ):(
                    <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
                        <div className="reset-tw">
                            <Markdown>
                                {item.content}

                            </Markdown>
                            
                        </div>
                    </div>
                )}
            </div>
        )
      }
    </div>
  );
};

export default CreationsItems;
