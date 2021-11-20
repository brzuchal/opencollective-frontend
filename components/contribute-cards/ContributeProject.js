import React from 'react';
import PropTypes from 'prop-types';
import { get, truncate } from 'lodash';

import { ContributionTypes } from '../../lib/constants/contribution-types';

import Link from '../Link';
import StyledLink from '../StyledLink';

import Contribute from './Contribute';

/**
 * A contribute card specialized to display a Project.
 */
const ContributeProject = ({ collective, project, ...props }) => {
  const description = truncate(project.description, { length: 100 });
  return (
    <Contribute
      route={`/${collective.slug}/projects/${project.slug}`}
      type={ContributionTypes.PROJECT}
      contributors={project.contributors}
      stats={project.stats.backers}
      image={project.backgroundImageUrl}
      color={get(collective, 'settings.collectivePage.primaryColor')}
      title={
        <StyledLink as={Link} color="black.800" href={`/${collective.slug}/projects/${project.slug}`}>
          {project.name}
        </StyledLink>
      }
      {...props}
    >
      {description}
    </Contribute>
  );
};

ContributeProject.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    backgroundImageUrl: PropTypes.string,
    settings: PropTypes.object,
    contributors: PropTypes.arrayOf(PropTypes.object),
    stats: PropTypes.shape({
      backers: PropTypes.object,
    }).isRequired,
  }),
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
};

export default ContributeProject;
