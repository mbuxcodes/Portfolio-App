import { useParams, Link } from "react-router-dom";
import { useGetProjectBySlugQuery } from "@/features/projects/projectsApi";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import PageMeta from "@/components/PageMeta";

function ProjectDetailPage() {
  const { slug } = useParams();
  const {
    data: projectResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProjectBySlugQuery(slug);

  if (isLoading) {
    return <LoadingSpinner label="Loading project" />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[900px] px-md py-xl">
        <ErrorState
          message="This project could not be found."
          onRetry={refetch}
        />
        <Link
          to="/projects"
          className="mt-md inline-block text-primary hover:text-primary-hover"
        >
          ← Back to all projects
        </Link>
      </div>
    );
  }

  const project = projectResponse.data;

  return (
    <div className="mx-auto max-w-[900px] px-md py-xl">
      <PageMeta
        title={project.title}
        description={project.problem}
        image={project.coverImage}
      />
      <Badge tone="muted">{project.category}</Badge>
      <h1 className="pb-sm pt-sm">{project.title}</h1>

      <div className="flex flex-wrap gap-1 pb-md">
        {project.techStack.map((tech) => (
          <Badge key={tech._id} tone="primary">
            {tech.name}
          </Badge>
        ))}
      </div>

      <img
        src={project.coverImage}
        alt={`${project.title} cover`}
        className="mb-lg h-64 w-full rounded-[--radius] bg-surface object-cover"
      />

      <div className="flex gap-sm pb-xl">
        {project.liveLink && (
          <a href={project.liveLink} target="_blank" rel="noreferrer">
            <Button variant="primary">Live Demo</Button>
          </a>
        )}
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            <Button variant="secondary">GitHub</Button>
          </a>
        )}
      </div>

      <section className="pb-lg">
        <h2 className="pb-sm">Problem</h2>
        <p className="text-muted">{project.problem}</p>
      </section>

      <section className="pb-lg">
        <h2 className="pb-sm">Solution</h2>
        <p className="text-muted">{project.solution}</p>
      </section>

      <section className="pb-lg">
        <h2 className="pb-sm">Results</h2>
        <p className="text-muted">{project.results}</p>
      </section>

      {project.role && (
        <section className="pb-lg">
          <h2 className="pb-sm">My Role</h2>
          <p className="text-muted">{project.role}</p>
        </section>
      )}

      <Link to="/projects" className="text-primary hover:text-primary-hover">
        ← Back to all projects
      </Link>
    </div>
  );
}

export default ProjectDetailPage;
