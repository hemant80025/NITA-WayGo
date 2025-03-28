export default function LoadingSpinner() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}