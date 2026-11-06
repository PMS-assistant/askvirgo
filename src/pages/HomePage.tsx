import Hero from '../components/home/Hero';
import VirgoIntro from '../components/home/VirgoIntro';
import ProductTour from '../components/home/ProductTour';
import LogoRunner from '../components/home/LogoRunner';
import HowVirgoWorks from '../components/home/HowVirgoWorks';
import Faq from '../components/home/Faq';
import VirgoPilotCTA from '../components/virgo/VirgoPilotCTA';
import ScrollColorWash from '../components/home/ScrollColorWash';

export default function HomePage() {
  return (
    <>
      {/* Renders nothing — drives the --wash token as you scroll, so the
          ground colour drifts between sections. Homepage only; the other
          routes keep the static porcelain. */}
      <ScrollColorWash />

      <Hero />

      {/* What Virgo is (the constellation), then its five capabilities.
          Carries the #virgo anchor the navbar's "Product" link uses. */}
      <VirgoIntro />

      {/* Inside Virgo: an automatic tour of the real product's screens. */}
      <ProductTour />

      {/* The PMS logos, scrolling continuously. No heading. */}
      <LogoRunner />


      {/* How Virgo works: five points, each with a small product scene. */}
      <HowVirgoWorks />

      {/* Questions a general manager or owner asks before a demo. */}
      <Faq />

      {/* The ask. */}
      <div id="pilot">
        <VirgoPilotCTA />
      </div>
    </>
  );
}
