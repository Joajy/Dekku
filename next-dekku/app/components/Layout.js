// src/app/components/Layout.js
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-8"> {/* Adjust the padding bottom to match Footer height */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
