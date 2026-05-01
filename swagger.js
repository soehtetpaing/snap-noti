const swaggerJsdoc = require("swagger-jsdoc");

const apiUrl = process.env.API_URL;
const version = process.env.VERSION;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Snap Noti",
      version: version,
      description: "Snap Noti REST APIs documentation",
      contact: {
        name: "API Support",
        url: "https://port4olio.pages.dev",
        email: "developer.geniusiq@gmail.com"
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
    servers: [
      {
        url: apiUrl,
      },
    ],
  },
  apis: ["./src/routes/*.js"], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

// remove internal schemas from swaggerSpec
if (swaggerSpec.components && swaggerSpec.components.schemas) {
  const internalSchemas = [];
  
  Object.keys(swaggerSpec.components.schemas).forEach(key => {
    if (swaggerSpec.components.schemas[key]['x-internal']) {
      internalSchemas.push(key);
    }
  });
  
  internalSchemas.forEach(key => {
    delete swaggerSpec.components.schemas[key];
  });
  
  if (swaggerSpec.paths) {
    Object.keys(swaggerSpec.paths).forEach(path => {
      Object.keys(swaggerSpec.paths[path]).forEach(method => {
        const responses = swaggerSpec.paths[path][method].responses;
        if (responses) {
          Object.keys(responses).forEach(responseCode => {
            const content = responses[responseCode].content;
            if (content && content['application/json'] && content['application/json'].schema) {
              const schema = content['application/json'].schema;
              if (schema.allOf) {
                schema.allOf = schema.allOf.filter(item => {
                  if (item.$ref) {
                    const refName = item.$ref.split('/').pop();
                    return !internalSchemas.includes(refName);
                  }
                  return true;
                });
                if (schema.allOf.length === 0) {
                  delete schema.allOf;
                }
              }
            }
          });
        }
      });
    });
  }
}

module.exports = swaggerSpec;
