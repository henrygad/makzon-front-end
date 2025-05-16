const Displayblogpostloading = ({ displayType }: { displayType: string }) => {
  return (
    <>
      <div className="w-full space-y-4 p-2 rounded-md animate-pulse">
        <div className="flex items-start justify-between gap-6">
          <div className="flex justify-start items-start gap-2">
            <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
            <div className="w-[80px] h-3 bg-slate-300 rounded mt-2"></div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-slate-300 "></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-300 rounded"></div>
          <div className="h-20 bg-slate-300 rounded"></div>
        </div>
        <div className="h-36 bg-slate-300 rounded"></div>
        <div className="h-4 bg-slate-300 rounded"></div>
      </div>
      <div className="w-full space-y-4 p-2 rounded-md animate-pulse">
        {displayType.toLowerCase() === "_html" ? (
          <div className="border-t border-b">
            <div className="flex items-center gap-6 p-2">
              <div className="px-4 py-0.5 rounded-full bg-slate-400 "></div>
              <div className="px-4 py-0.5 rounded-full bg-slate-300 "></div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Displayblogpostloading;
