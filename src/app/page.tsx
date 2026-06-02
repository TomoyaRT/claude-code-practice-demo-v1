import { Hero }            from "@/components/sections/Hero"
import { About }           from "@/components/sections/About"
import { WorkSection }     from "@/components/sections/WorkSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { ContactSection }  from "@/components/sections/ContactSection"

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WorkSection />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
