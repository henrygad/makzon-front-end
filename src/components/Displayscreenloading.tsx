import { useEffect } from "react";

const Displayscreenloading = ({ loading }: { loading: boolean }) => {
  useEffect(() => {
    if (loading) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [loading]);

  return loading ? (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 backdrop-blur-sm z-50"
      style={{ margin: 0 }}
    >
      <div className="w-full h-full flex justify-center items-center">
        <span className="flex gap-2 p-2">
          <span className="block h-6 w-6 border-4 border-slate-100 rounded-full"></span>
          <span className="absolute animate-spin h-6 w-6 border-t-4 border-l-4 border-green-600 rounded-full"></span>
        </span>
      </div>
    </div>
  ) : null;
};

export default Displayscreenloading;
