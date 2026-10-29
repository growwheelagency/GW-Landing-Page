import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Strip from "../components/Strip";
import Promises from "../components/Promises";
import Problem from "../components/Problem";
import System from "../components/System";
import Shop from "../components/Shop";
import Process from "../components/Process";
import Founders from "../components/Founders";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Promises />
        <Problem />
        <System />
        <Process />
        <Founders />
        <Shop />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
