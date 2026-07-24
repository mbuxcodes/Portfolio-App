import { useGetAboutQuery } from "@/features/about/aboutApi";
import { useGetSkillsQuery } from "@/features/skills/skillsApi";
import { useGetExperiencesQuery } from "@/features/experience/experienceApi";
import { useGetEducationQuery } from "@/features/education/educationApi";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";

function AboutPage() {
  const {
    data: aboutResponse,
    isLoading: isLoadingAbout,
    isError: isAboutError,
    refetch: refetchAbout,
  } = useGetAboutQuery();
  const { data: skillsResponse, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const { data: experiencesResponse, isLoading: isLoadingExperiences } =
    useGetExperiencesQuery();
  const { data: educationResponse, isLoading: isLoadingEducation } =
    useGetEducationQuery();

  const about = aboutResponse?.data;
  const skills = skillsResponse?.data || [];
  const experiences = experiencesResponse?.data || [];
  const educationEntries = educationResponse?.data || [];

  return (
    <div className="mx-auto max-w-[1200px] px-md py-xl">
      <section className="pb-xl">
        {isLoadingAbout && <LoadingSpinner label="Loading about content" />}
        {isAboutError && (
          <ErrorState
            message="Could not load about content."
            onRetry={refetchAbout}
          />
        )}
        {about && (
          <>
            <h1 className="pb-sm">{about.headline || "About Me"}</h1>
            {about.profileImage && (
              <img
                src={about.profileImage}
                alt="Profile"
                className="mb-md h-32 w-32 rounded-full object-cover"
              />
            )}
            <p className="max-w-2xl text-muted">
              {about.bio || "Bio coming soon."}
            </p>
            {about.highlights?.length > 0 && (
              <ul className="mt-sm flex flex-wrap gap-sm">
                {about.highlights.map((highlight) => (
                  <li key={highlight}>
                    <Badge tone="primary">{highlight}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <nav className="flex gap-md border-b border-border pb-sm">
        <a href="#skills" className="text-small text-muted hover:text-primary">
          Skills
        </a>
        <a
          href="#experience"
          className="text-small text-muted hover:text-primary"
        >
          Experience
        </a>
        <a
          href="#education"
          className="text-small text-muted hover:text-primary"
        >
          Education
        </a>
      </nav>

      <section id="skills" className="py-xl">
        <h2 className="pb-md">Skills</h2>
        {isLoadingSkills && <LoadingSpinner label="Loading skills" />}
        {!isLoadingSkills && skills.length === 0 && (
          <p className="text-muted">No skills to show yet.</p>
        )}
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          {skills.map((skill) => (
            <Card key={skill._id}>
              <div className="flex items-center justify-between">
                <h3>{skill.name}</h3>
                <Badge tone="primary">{skill.proficiency}</Badge>
              </div>
              <p className="pt-sm text-small text-muted">{skill.narrative}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="experience" className="py-xl">
        <h2 className="pb-md">Experience</h2>
        {isLoadingExperiences && <LoadingSpinner label="Loading experience" />}
        {!isLoadingExperiences && experiences.length === 0 && (
          <p className="text-muted">No experience to show yet.</p>
        )}
        <div className="flex flex-col gap-md">
          {experiences.map((exp) => (
            <Card key={exp._id}>
              <div className="flex items-center justify-between">
                <h3>{exp.role}</h3>
                <span className="text-small text-muted">
                  {new Date(exp.startDate).getFullYear()} —{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : "Present"}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{exp.company}</p>
              <p className="pt-sm">{exp.description}</p>
              <div className="flex flex-wrap gap-1 pt-sm">
                {exp.techUsed.map((skill) => (
                  <Badge key={skill._id} tone="primary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="education" className="py-xl">
        <h2 className="pb-md">Education</h2>
        {isLoadingEducation && <LoadingSpinner label="Loading education" />}
        {!isLoadingEducation && educationEntries.length === 0 && (
          <p className="text-muted">No education to show yet.</p>
        )}
        <div className="flex flex-col gap-md">
          {educationEntries.map((edu) => (
            <Card key={edu._id}>
              <div className="flex items-center justify-between">
                <h3>{edu.degree}</h3>
                <span className="text-small text-muted">
                  {new Date(edu.startDate).getFullYear()} —{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : "Present"}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{edu.institution}</p>
              {edu.description && <p className="pt-sm">{edu.description}</p>}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
