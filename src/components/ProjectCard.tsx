import React from 'react';
import '../styles/project-card.css';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <div className="card-image">
        <img src={project.imageUrl} alt={project.title} />
      </div>
      <div className="card-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="card-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <button className="btn card-btn">View Project</button>
      </div>
    </div>
  );
};

export default ProjectCard;