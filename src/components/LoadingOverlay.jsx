export default function LoadingOverlay({ show, text = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      {/* <p className="text-white mt-3 text-lg font-semibold">{text}</p> */}
    </div>
  );
}
