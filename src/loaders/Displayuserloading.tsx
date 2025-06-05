
const Displayuserloading = ({ className }: { className?: string }) => {
    return <div className={`space-y-2 animate-pulse ${className}`}>
        <div className="w-12 h-12 bg-slate-300 rounded-full"></div>
        <div className="space-y-1">
            <div className="w-[80px] h-2.5 bg-slate-300 rounded"></div>
            <div className="w-[70px] h-2.5 bg-slate-300 rounded"></div>
        </div>
    </div>;
};

export default Displayuserloading;
