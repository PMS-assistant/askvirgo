import Hero from '../components/home/Hero';
import PromiseCards from '../components/home/PromiseCards';
import MeetVirgo from '../components/home/MeetVirgo';
import BeforeAfter from '../components/home/BeforeAfter';
import CapabilityBento from '../components/home/CapabilityBento';
import Integrations from '../components/home/Integrations';
import WhoItsFor from '../components/home/WhoItsFor';
import ReadOnlyBand from '../components/home/ReadOnlyBand';
import Faq from '../components/home/Faq';
import VirgoProblem from '../components/virgo/VirgoProblem';
import VirgoHowItWorks from '../components/virgo/VirgoHowItWorks';
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

      {/* Three promises straight away; the third (read-only) is the one that
          sets Virgo apart. */}
      <PromiseCards />

      {/* The product itself, before any explanation. */}
      <MeetVirgo />

      {/* Say what's wrong before selling the fix. */}
      <VirgoProblem />

      {/* The transformation: a working day collapsing from five apps to one question. */}
      <BeforeAfter />

      {/* What you can do (carries the #virgo nav anchor), then what it connects to. */}
      <CapabilityBento />
      <Integrations />

      <WhoItsFor />

      {/* The page's one dark band. */}
      <ReadOnlyBand />

      <VirgoHowItWorks />
      <Faq />

      <div id="pilot">
        <VirgoPilotCTA />
      </div>
    </>
  );
}
