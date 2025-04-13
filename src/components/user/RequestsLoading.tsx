
export const RequestsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5">
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
