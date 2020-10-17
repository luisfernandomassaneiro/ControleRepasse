export class UsuarioModel {
  id: number;
  username: string;
  nome: string;
  email: string;
  active = true;
  sexo: string;
  nascimento: Date;
  tipoUsuario: string;
  avatar: string;
}
