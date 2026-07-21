import { useParams, Link } from 'react-router-dom';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

// TODO (Milestone 2): replace with useGetProjectBySlugQuery(slug) from projectsApi
const placeholderProject = {
  title: 'Project One',
  category: 'Personal',
  techStack: ['React', 'Node.js', 'MongoDB'],
  coverImage: null,
  liveLink: '#',
  githubLink: '#',
  problem: 'Placeholder description of the problem this project solves.',
  solution: 'Placeholder description of the approach and technical decisions made.',
  results: 'Placeholder description of the outcome, metrics, or lessons learned.',
  role: 'Sole developer — designed, built, and deployed the full application.',
};

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = placeholderProject; // TODO: fetch by `slug` in Milestone 2

  return (
    <div className="mx-auto max-w-[900px] px-md py-xl">
      <Badge tone="muted">{project.category}</Badge>
      <h1 className="pb-sm pt-sm">{project.title}</h1>

      <div className="flex flex-wrap gap-1 pb-md">
        {project.techStack.map((tech) => (
          <Badge key={tech} tone="primary">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mb-lg h-64 rounded-[--radius] bg-surface" aria-hidden="true" />

      <div className="flex gap-sm pb-xl">
        <a href={project.liveLink} target="_blank" rel="noreferrer">
          <Button variant="primary">Live Demo</Button>
        </a>
        <a href={project.githubLink} target="_blank" rel="noreferrer">
          <Button variant="secondary">GitHub</Button>
        </a>
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

      <section className="pb-lg">
        <h2 className="pb-sm">My Role</h2>
        <p className="text-muted">{project.role}</p>
      </section>

      <Link to="/projects" className="text-primary hover:text-primary-hover">
        ← Back to all projects
      </Link>
    </div>
  );
}

export default ProjectDetailPage;
