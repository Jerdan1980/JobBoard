import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

//https://www.npmjs.com/package/swagger-ui-react
export default function Swagger() {
  return (
    <div class="bg-white p-3 rounded-3">
      <SwaggerUI url="/swagger/v1/swagger.json" />
    </div>
  );
}
