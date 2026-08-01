import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from '../src/hooks/useAuth';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { Simulator } from '../src/pages/Simulator';

const helmetContext: { helmet?: HelmetServerState } = {};
const html = ReactDOMServer.renderToString(
  <HelmetProvider context={helmetContext}>
    <AuthProvider>
      <StaticRouter location="/simulator">
        <Simulator />
      </StaticRouter>
    </AuthProvider>
  </HelmetProvider>
);
console.log("HELMET?", helmetContext.helmet !== undefined);
if (helmetContext.helmet) {
  console.log("META:", helmetContext.helmet.meta.toString());
}
