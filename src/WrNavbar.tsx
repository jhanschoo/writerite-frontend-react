import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class WrNavbar extends Component {
  public render() {
    return (
      <Menu>
        <Menu.Item as={Link} header={true} to="/">
          WriteRite
      </Menu.Item>
      </Menu>
    );
  }
}

export default WrNavbar;
