import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/quote/PricingCalculator";

const GetQuote = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PricingCalculator />
      <Footer />
    </div>
  );
};

export default GetQuote;
