import React from "react";
//gets current date
export default function CurrentDate() {
  const date = new Date();
  const dateF = date.toLocaleDateString();
  return (
    <div className="text-xl font-bold my-3 px-2 py-1 rounded-md bg-violet-700">
      {dateF}
    </div>
  );
}
