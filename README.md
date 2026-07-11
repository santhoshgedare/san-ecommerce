# san-ecommerce

Enterprise e-commerce starter with ASP.NET Core and Angular.

## Security and permission configuration

- Role permissions are stored with each role and enforced through permission claims in JWT tokens.
- CORS is configuration-driven through `Cors:AllowedOrigins` in `/src/san-ecommerce-app.API/appsettings*.json`.
- Leave `Cors:AllowedOrigins` empty only for unrestricted local development; set explicit origins for shared or production environments.
- Administrator bootstrap seeding is disabled by default and must be explicitly enabled through `Seed:Admin`.
