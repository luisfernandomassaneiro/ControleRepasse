import { SubjectModel } from '@shared/models/subject.model';

export class JwtResponseModel {
  token: string;
  type: string;
  subject: SubjectModel;
}
