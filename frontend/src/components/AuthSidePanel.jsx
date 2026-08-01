import React from "react";

const SampleCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg p-4 w-64 ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="badge bg-violet-100 text-violet-700">Pending</span>
      <span className="badge bg-orange-100 text-orange-700">Medium Priority</span>
    </div>
    <h4 className="font-semibold text-sm text-gray-900">Social Media Campaign</h4>
    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
      Develop a content plan for the upcoming product launch. Create visually appealing designs.
    </p>
    <div className="mt-2">
      <p className="text-[10px] text-gray-400 mb-1">Task Done: 4 / 10</p>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary w-2/5 rounded-full" />
      </div>
    </div>
    <div className="flex justify-between text-[10px] text-gray-400 mt-2">
      <span>Start Date<br />16th Mar 2025</span>
      <span>Due Date<br />25th Mar 2025</span>
    </div>
  </div>
);

const AuthSidePanel = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden items-center justify-center">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_49%,white_49%,white_51%,transparent_51%)] bg-[length:40px_40px]" />
      <div className="relative flex flex-col gap-10 items-start">
        <SampleCard className="-translate-x-6" />
        <div className="flex gap-4 pl-10">
          <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 w-48">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div>
              <p className="text-xs font-semibold">Adam Cole</p>
              <p className="text-[10px] text-gray-400">adam@timetoprogram.com</p>
            </div>
          </div>
        </div>
        <SampleCard className="translate-x-10" />
      </div>
    </div>
  );
};

export default AuthSidePanel;
