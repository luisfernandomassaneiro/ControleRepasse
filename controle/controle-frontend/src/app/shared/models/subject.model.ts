import { CodeNameModel } from '@shared/models/code-name.model';

export class SubjectModel {
  id: number;
  firstName: string;
  nome: string;
  username: string;
  email: string;
  avatar: string;
  signOutAllowed = true;
}
