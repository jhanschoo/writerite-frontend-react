import React, { PureComponent } from 'react';

import { Segment, Container, Card, Placeholder } from 'semantic-ui-react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { DECK_QUERY, DeckData, DeckVariables } from './gql';

import { connect } from 'react-redux';
import { WrState } from '../store';
import { CurrentUser } from '../signin/types';

import WrNavbar from '../WrNavbar';
import WrCardsList from '../card/WrCardsList';
import WrCardListNavbar from '../card/WrCardListNavbar';

type DeckDetailRouteProps = RouteComponentProps<{ deckId: string }>;
type OwnProps = DeckDetailRouteProps;
type DispatchProps = object;
interface StateProps {
  readonly user: CurrentUser | null;
}
type Props = StateProps & DispatchProps & OwnProps;

class WrRoomDetail extends PureComponent<Props> {

  public readonly render = () => {
    const { match } = this.props;
    const { deckId } = match.params;
    const { renderRoom } = this;
    return (
      <Query query={DECK_QUERY} variables={{ deckId }}>
        {renderRoom}
      </Query>
    );
  }

  private renderRoom = ({
    loading, error, data,
  }: QueryResult<DeckData, DeckVariables>) => {
    const { name, owner: { email } } = (data && data.rwDeck) || {
      name: null,
      owner: {
        email: null,
      },
    };
    const { deckId } = this.props.match.params;
    const formattedDeckName = (loading) ? (
      <Card.Header>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </Card.Header>
    ) :  (<Card.Header>{name}</Card.Header>);
    const formattedOwner = (loading) ? (
      <Card.Meta>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </Card.Meta>
    ) : (<Card.Meta>by {email}</Card.Meta>);
    const formattedError = error
      && <Card.Content>Error: {error.message}</Card.Content>;
    return (
      <>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrCardListNavbar />
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Card fluid={true}>
              <Card.Content>
                {formattedDeckName}
                {formattedOwner}
              </Card.Content>
              {formattedError}
              <WrCardsList deckId={deckId} />
            </Card>
          </Container>
        </Segment>
      </>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

export default withRouter<OwnProps>(
  connect<StateProps, {}, OwnProps>(mapStateToProps)(WrRoomDetail),
);
