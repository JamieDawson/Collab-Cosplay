const PlacesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Browse by Location
          </h1>
          <p className="text-gray-600">No location selected</p>
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
