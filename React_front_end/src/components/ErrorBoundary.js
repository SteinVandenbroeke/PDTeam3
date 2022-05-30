// Short Description: File to define errors
// @author : PPDB Team 3

import React from 'react';
import {Card, Container} from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error:"" };
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>
          <header>
                <Container style={{paddingTop: 20, paddingBottom: 30}}>
                    <Card className={"shadow-lg"} style={{padding: 30}}>
                        <div style={{textAlign: "center", paddingTop: 40, zIndex: 1}}>
                            <img  style={{width: "60%"}} src={"/svg/renderError.svg"}/>
                            <h1 style={{paddingTop: 40}}>Render fout</h1>
                            <h3>Open een andere pagina of probeer opnieuw</h3>
                            <br/>
                             <Card className={"shadow-lg"} style={{padding: 30, backgroundColor:"#ff000060", textAlign: "left"}}>
                                 <h2>{this.state.error.name}</h2>
                                 <h6>{this.state.error.message}</h6>
                                 check console for more information
                            </Card>
                        </div>
                    </Card>
                </Container>
            </header>
        </div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;