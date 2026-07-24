import { Link } from "react-router-dom";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetProjectsQuery } from "@/features/projects/projectsApi";
import { useGetSkillsQuery } from "@/features/skills/skillsApi";
import { useGetAboutQuery } from "@/features/about/aboutApi";

function HomePage() {
  const { data: projectsResponse, isLoading: isLoadingProjects } =
    useGetProjectsQuery({});
  const { data: skillsResponse, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const { data: aboutResponse, isLoading: isLoadingAbout } = useGetAboutQuery();

  const featuredProjects = (projectsResponse?.data || []).filter(
    (project) => project.featured,
  );
  const topSkills = (skillsResponse?.data || []).slice(0, 8); // homepage teaser shows a subset, full list lives on /about
  const about = aboutResponse?.data;
  return (
    <div className="mx-auto max-w-[1200px] px-md">
      {/* Hero */}
      <section className="flex flex-col items-start gap-sm py-2xl">
        <h1 className="text-display font-bold">Your Name</h1>
        <p className="max-w-xl text-body text-muted">
          Full Stack Developer specializing in the MERN stack — I build
          production-grade web applications, end to end.
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
        {isLoadingProjects && <LoadingSpinner label="Loading projects" />}
        {!isLoadingProjects && featuredProjects.length === 0 && (
          <p className="text-muted">No featured projects yet.</p>
        )}
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link key={project._id} to={`/projects/${project.slug}`}>
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
        {isLoadingSkills && <LoadingSpinner label="Loading skills" />}
        {!isLoadingSkills && topSkills.length === 0 && (
          <p className="text-muted">No skills to show yet.</p>
        )}
        <div className="flex flex-wrap gap-sm">
          {topSkills.map((skill) => (
            <Badge key={skill._id} tone="primary">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="py-xl">
        <h2 className="pb-md">About</h2>
        {isLoadingAbout && <LoadingSpinner label="Loading about content" />}
        <p className="max-w-2xl text-muted">
          {about?.bio || "Bio coming soon."}
        </p>
        <Link
          to="/about"
          className="mt-sm inline-block text-primary hover:text-primary-hover"
        >
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
