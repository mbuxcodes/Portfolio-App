import Card from '@/components/Card';
import Badge from '@/components/Badge';

// TODO (Milestone 2): replace all placeholders below with real RTK Query hooks
// (useGetAboutQuery, useGetSkillsQuery, useGetExperiencesQuery, useGetEducationQuery)
const placeholderSkills = [
  { id: '1', name: 'React', proficiency: 'Advanced', category: 'Frontend' },
  { id: '2', name: 'Node.js', proficiency: 'Advanced', category: 'Backend' },
];

const placeholderExperience = [
  {
    id: '1',
    company: 'Company Name',
    role: 'Software Engineer',
    startDate: '2023',
    endDate: 'Present',
    description: 'Placeholder description of responsibilities and impact.',
  },
];

const placeholderEducation = [
  {
    id: '1',
    institution: 'University Name',
    degree: 'B.Sc. Computer Science',
    startDate: '2019',
    endDate: '2023',
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-md py-xl">
      <section className="pb-xl">
        <h1 className="pb-sm">About Me</h1>
        <p className="max-w-2xl text-muted">
          Placeholder bio — replaced by real content from the singleton AboutContent document in
          Milestone 2.
        </p>
      </section>

      <nav className="flex gap-md border-b border-border pb-sm">
        <a href="#skills" className="text-small text-muted hover:text-primary">
          Skills
        </a>
        <a href="#experience" className="text-small text-muted hover:text-primary">
          Experience
        </a>
        <a href="#education" className="text-small text-muted hover:text-primary">
          Education
        </a>
      </nav>

      <section id="skills" className="py-xl">
        <h2 className="pb-md">Skills</h2>
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          {placeholderSkills.map((skill) => (
            <Card key={skill.id}>
              <div className="flex items-center justify-between">
                <h3>{skill.name}</h3>
                <Badge tone="primary">{skill.proficiency}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="experience" className="py-xl">
        <h2 className="pb-md">Experience</h2>
        <div className="flex flex-col gap-md">
          {placeholderExperience.map((exp) => (
            <Card key={exp.id}>
              <div className="flex items-center justify-between">
                <h3>{exp.role}</h3>
                <span className="text-small text-muted">
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{exp.company}</p>
              <p className="pt-sm">{exp.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="education" className="py-xl">
        <h2 className="pb-md">Education</h2>
        <div className="flex flex-col gap-md">
          {placeholderEducation.map((edu) => (
            <Card key={edu.id}>
              <div className="flex items-center justify-between">
                <h3>{edu.degree}</h3>
                <span className="text-small text-muted">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{edu.institution}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
