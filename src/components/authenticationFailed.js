import React from 'react'

const errorMessage = err => {
  switch (err.error) {
    case 'access_denied':
      return <p>Access was denied to the application. Please contact an administrator for assistance.</p>
    default:
      return <p>An unknown error occurred. Please try again later.</p>
  }
}

export default props =>
  <div className="jumbotron jumbotron-danger">
    <h1>USER AUTHENTICATION FAILED!</h1>
    { errorMessage(props.error) }
  </div>;


{/* <p>  <br /> <br />
Possible Reasons <br />
1. Timed Out  <br />
2. Expired Credentials <br />
3. Bad Credentials <br />
4. Too many login attempts <br /> <br />

Possible Actions <br />
1. Check your Auth0 credentials/clientID <br />
2. A link to myQ to open a new ticket: myQ/newTicket <br />
3. Try again later in X minutes <br />
</p> */}
