import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="flex flex-col min-h-screen bg-rose-50">
      <div className="flex flex-col flex-grow">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-rose-100 to-amber-100 flex-1">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 tracking-tight">
            🚀 AI-Powered Dog Health Assistant
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Get instant AI analysis for skin diseases, blood reports, and pet health records.  
            Ensure your furry friend stays happy and healthy! 🐾
          </p>
          <img
            src="/dog-banner.jpg"
            alt="Happy Dog"
            className="mx-auto mt-6 w-64 md:w-80 rounded-xl shadow-lg"
          />
          <div className="mt-6">
            <Link
              to="/profile"
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 py-10 flex-1">
          
          {/* Skin Analysis */}
          <div
            className="relative bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 flex flex-col justify-between h-full"
            style={{
              backgroundImage: "url('/dog-skin-analysis.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-white">Instant AI Skin Analysis</h3>
                <p className="text-white mt-2">
                  Upload a clear image of your dog's skin and our AI will instantly analyze  
                  potential infections, rashes, or unusual changes.
                </p>
              </div>
              <Link
                to="/upload"
                className="mt-4 inline-block bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 hover:bg-white hover:text-rose-500 border border-transparent hover:border-rose-500 mx-auto"
              >
                Try Now →
              </Link>
            </div>
          </div>

          {/* Blood Report */}
          <div
            className="relative bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 flex flex-col justify-between h-full"
            style={{
              backgroundImage: "url('/dog-blood-report.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-white">Blood Report Insights</h3>
                <p className="text-white mt-2">
                  Upload your dog's blood report, and our AI will interpret key health markers,  
                  providing insights into infections, deficiencies, or underlying conditions.
                </p>
              </div>
              <Link
                to="/blood-report"
                className="mt-4 inline-block bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 hover:bg-white hover:text-rose-500 border border-transparent hover:border-rose-500 mx-auto"
              >
                Analyze Report →
              </Link>
            </div>
          </div>

          {/* Health Records */}
          <div
            className="relative bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 flex flex-col justify-between h-full"
            style={{
              backgroundImage: "url('/dog-health-records.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-white">Pet Health Records & Reminders</h3>
                <p className="text-white mt-2">
                  Upload an image or data about your dog's health, and our AI will maintain records  
                  and set up reminders for vet visits, vaccinations, and medications.
                </p>
              </div>
              <Link
                to="/reminders"
                className="mt-4 inline-block bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 hover:bg-white hover:text-rose-500 border border-transparent hover:border-rose-500 mx-auto"
              >
                Set Reminders →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;