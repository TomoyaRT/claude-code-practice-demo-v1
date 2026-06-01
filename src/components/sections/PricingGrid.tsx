import { services } from "@/data/services"
import { ServiceCard } from "./ServiceCard"

export function PricingGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6 items-start mt-8">
      {services.map((service, index) => (
        <ServiceCard key={service.id} service={service} index={index} />
      ))}
    </div>
  )
}
