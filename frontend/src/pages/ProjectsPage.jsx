import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

const categories = ['All', 'Personal', 'Freelance', 'Open Source', 'Academic'];

// TODO (Milestone 2): replace with useGetProjectsQuery({ category }) from projectsApi
const placeholderProjects = [
  { id: '1', title: 'Project One', category: 'Personal', slug: 'project-one', techStack: ['React', 'Node.js'] },
  { id: '2', title: 'Project Two', category: 'Freelance', slug: 'project-two', techStack: ['MongoDB'] },
];

function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects =
    activeCategory === 'All'
      ? placeholderProjects
      : placeholderProjects.filter((project) => project.category === activeCategory);

  return (
    <div className="mx-auto max-w-[1200px] px-md py-xl">
      <h1 className="pb-md">Projects</h1>

      <div className="flex flex-wrap gap-sm pb-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-sm py-1 text-small font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link key={project.id} to={`/projects/${project.slug}`}>
            <Card interactive className="h-full">
              <Badge tone="muted">{project.category}</Badge>
              <h3 className="pt-sm pb-1">{project.title}</h3>
              <div className="flex flex-wrap gap-1 pt-1">
                {project.techStack.map((tech) => (
                  <Badge key={tech} tone="primary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
