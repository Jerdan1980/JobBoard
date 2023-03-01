import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };

		this.Links =[
			{ to: "/", name: "Home"},
			//{ to: "/counter", name: "Counter"},
			//{ to: "/fetch-data", name: "Fetch Data"},
			//{ to: "/self", name: "Account"},
			{ to: "/jobs", name: "Jobs"},
			{ to: "/industries", name: "Industries"},
			{ to: "/competitions", name: "Competitions"},
			{ to: "/tags", name: "Tags"},
		];
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar navbar-expand-md navbar-dark bg-primary mb-3" container light>
          <NavbarBrand tag={Link} to="/">CNC</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-md-inline-flex flex-md-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
							{this.Links.map(link => (
								<NavItem key={link.name}>
									<NavLink tag={Link} className="nav-link" to={link.to}>{link.name}</NavLink>
								</NavItem>
							))}
              <LoginMenu>
              </LoginMenu>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
