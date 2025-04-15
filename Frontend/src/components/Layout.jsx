import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot"; // ✅ Use custom chatbot

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />

      {/* 💬 Floating custom chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
