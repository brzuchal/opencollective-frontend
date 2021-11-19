import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatCurrency } from '../../../lib/currency-utils';

import Container from '../../Container';
import { Flex } from '../../Grid';
import LoadingPlaceholder from '../../LoadingPlaceholder';
import ProportionalAreaChart from '../../ProportionalAreaChart';
import { P, Span } from '../../Text';

const getMoneyManagedChartAreas = (hostBalance, collectivesBalance, hostCurrency, isLoading) => {
  return [
    {
      key: 'organization',
      color: 'primary.800',
      label: isLoading ? (
        <LoadingPlaceholder width={195} height={16} />
      ) : (
        <P fontSize="12px" lineHeight="18px" color="black.700">
          <Span fontWeight="bold">{formatCurrency(hostBalance, hostCurrency)}</Span>
          <Span mx="6px" color="black.600">
            {' | '}
          </Span>
          <FormattedMessage id="TotalMoneyManagedSection.hostOrganization" defaultMessage="Host Organization" />
        </P>
      ),
    },
    {
      key: 'my-collectives',
      color: 'primary.500',
      label: isLoading ? (
        <LoadingPlaceholder width={165} height={16} />
      ) : (
        <P fontSize="12px" lineHeight="18px">
          <Span fontWeight="700">{formatCurrency(collectivesBalance, hostCurrency)}</Span>{' '}
          <Span mx="6px" color="black.600">
            {' | '}
          </Span>
          <FormattedMessage id="Collectives" defaultMessage="Collectives" />
        </P>
      ),
    },
  ];
};

const TotalMoneyManagedSection = ({ host, collectives, isLoading }) => {
  // Compute some general stats
  const hostMetrics = host?.hostMetrics;
  const hostBalance = host?.stats.balance.valueInCents;

  let collectivesBalance;
  if (!collectives || collectives.length === 0) {
    collectivesBalance = hostMetrics?.totalMoneyManaged.valueInCents - hostBalance;
  } else {
    collectivesBalance = hostMetrics?.totalMoneyManaged.valueInCents;
  }

  // Generate graph data (memoized for performances)
  const chartArgs = [hostBalance, collectivesBalance, host.currency, isLoading];
  const chartAreas = React.useMemo(() => getMoneyManagedChartAreas(...chartArgs), chartArgs);

  return (
    <div>
      {(!collectives || collectives.length === 0) && (
        <Flex flexWrap="wrap" my={14} alignItems="baseline">
          {isLoading ? (
            <LoadingPlaceholder height={21} width={125} />
          ) : (
            <Span fontSize={18} fontWeight="500">
              {formatCurrency(hostMetrics.totalMoneyManaged.valueInCents, host.currency)}
            </Span>
          )}
        </Flex>
      )}
      <Container display="flex" fontSize="11px" fontWeight="700" lineHeight="12px" alignItems="center">
        <Span textTransform="uppercase">
          <FormattedMessage
            id="TotalMoneyManagedSection.subHeading"
            defaultMessage="My Organization and My initiatives"
          />
        </Span>
      </Container>
      <Container mt={18} mb={12}>
        <ProportionalAreaChart areas={chartAreas} />
      </Container>
      <P minHeight="18px" fontSize="12px" fontWeight="400" lineHeight="18px" pt={12} pb={16}>
        <FormattedMessage
          id="Host.Metrics.TotalMoneyManages.description"
          defaultMessage="Total amount held in your bank account for the Host and its Collectives."
        />
      </P>
    </div>
  );
};

TotalMoneyManagedSection.propTypes = {
  isLoading: PropTypes.bool,
  host: PropTypes.shape({
    stats: PropTypes.shape({ balance: PropTypes.shape({ valueInCents: PropTypes.number }) }).isRequired,
    hostMetrics: PropTypes.object.isRequired,
    currency: PropTypes.string,
  }),
  collectives: PropTypes.arrayOf(PropTypes.object),
};

export default TotalMoneyManagedSection;
