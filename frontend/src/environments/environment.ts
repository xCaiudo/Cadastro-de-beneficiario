export const environment = {
  production: false,
  mockAuth: true, // true = pula Keycloak, usa usuário mock (apenas dev)
  apiUrl: 'http://localhost:3000',
  app: {
    frontendVersion: '1.0.0',
    backendVersion: '1.0.0',
    instance: 'Desenvolvimento',
  },
  oidc: {
    authority: 'http://localhost:8080/realms/beneficiario-realm',
    clientId: 'beneficiario-frontend',
  },
  mockUser: {
    given_name: 'João',
    family_name: 'Silva',
    preferred_username: 'joao.silva',
    sub: 'mock-user-001',
  },
};
