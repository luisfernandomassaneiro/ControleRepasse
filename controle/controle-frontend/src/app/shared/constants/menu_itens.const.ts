
export const navItems = [ {
  text : 'Principal',
  i18n : 'menu.main',
  group : true,
  hideInBreadcrumb : true,
  children : [{
    text : 'Usuario',
    link : '/security/usuario',
    i18n : 'menu.security.usuario',
    icon : 'fas fa-user'
  }, {
    text : 'Carro',
    link : '/security/carro',
    i18n : 'menu.security.carro',
    icon : 'fas fa-car'
  }]
} ];
