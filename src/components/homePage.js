import React from 'react';

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <h1 className="page-header">
              <i className="fa fa-2x fa-home" /> Home Page
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <div className="jumbotron text-center">
              <p>Hello, World!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
