import { projects } from "@/data/projects"
import { ProjectCard } from "./ProjectCard"

export function ProjectGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
