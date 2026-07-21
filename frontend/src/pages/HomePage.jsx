import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

// TODO (Milestone 2): replace with useGetProjectsQuery({ featured: true }) from projectsApi
const placeholderFeaturedProjects = [
  { id: '1', title: 'Project One', category: 'Personal', slug: 'project-one' },
  { id: '2', title: 'Project Two', category: 'Freelance', slug: 'project-two' },
];

// TODO (Milestone 2): replace with useGetSkillsQuery from skillsApi
const placeholderTopSkills = ['React', 'Node.js', 'MongoDB', 'Express'];

function HomePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-md">
      {/* Hero */}
      <section className="flex flex-col items-start gap-sm py-2xl">
        <h1 className="text-display font-bold">Your Name</h1>
        <p className="max-w-xl text-body text-muted">
          Full Stack Developer specializing in the MERN stack — I build production-grade web
          applications, end to end.
        </p>
        <div className="flex gap-sm pt-sm">
          {/* TODO (Milestone 2): wire to real resume URL from /api/resume */}
          <Button variant="primary">Download Resume</Button>
          <Link to="/contact">
            <Button variant="secondary">Contact Me</Button>
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-xl">
        <h2 className="pb-md">Featured Projects</h2>
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
          {placeholderFeaturedProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.slug}`}>
              <Card interactive className="h-full">
                <Badge tone="muted">{project.category}</Badge>
                <h3 className="pt-sm">{project.title}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Skills */}
      <section className="py-xl">
        <h2 className="pb-md">Top Skills</h2>
        <div className="flex flex-wrap gap-sm">
          {placeholderTopSkills.map((skill) => (
            <Badge key={skill} tone="primary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="py-xl">
        <h2 className="pb-md">About</h2>
        {/* TODO (Milestone 2): replace with useGetAboutQuery from aboutApi */}
        <p className="max-w-2xl text-muted">
          A short bio placeholder goes here, summarizing your background and what drives you as an
          engineer.
        </p>
        <Link to="/about" className="mt-sm inline-block text-primary hover:text-primary-hover">
          View Full About →
        </Link>
      </section>

      {/* Contact CTA */}
      <section className="flex flex-col items-center gap-sm rounded-[--radius] bg-surface py-2xl text-center">
        <h2>Let's build something</h2>
        <Link to="/contact">
          <Button variant="primary">Contact Me</Button>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
