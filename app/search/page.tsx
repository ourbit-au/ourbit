import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Search</h2>
        </div>
      </div>
    </div>
  );
}

export default page;
