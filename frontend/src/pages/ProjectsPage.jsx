import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProjectsQuery } from "@/features/projects/projectsApi";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import PageMeta from "@/components/PageMeta";

const categories = ["All", "Personal", "Freelance", "Open Source", "Academic"];

function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const {
    data: projectsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProjectsQuery({
    category: activeCategory,
  });

  const projects = projectsResponse?.data || [];

  return (
    <div className="mx-auto max-w-[1200px] px-md py-xl">
      <PageMeta
        title="Projects"
        description="Case studies of real production projects — problem, solution, and results for each."
      />
      <h1 className="pb-md">Projects</h1>

      <div className="flex flex-wrap gap-sm pb-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-sm py-1 text-small font-medium transition-colors ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner label="Loading projects" />}
      {isError && (
        <ErrorState message="Could not load projects." onRetry={refetch} />
      )}
      {!isLoading && !isError && projects.length === 0 && (
        <EmptyState message="No projects to show yet." />
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project.slug}`}>
              <Card interactive className="h-full">
                <Badge tone="muted">{project.category}</Badge>
                <h3 className="pt-sm pb-1">{project.title}</h3>
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack.map((tech) => (
                    <Badge key={tech._id} tone="primary">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
