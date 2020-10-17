import { Injectable } from '@angular/core';
import { SubjectModel } from '@shared/models/subject.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const TOKEN_KEY = (window as any)._authToken;
const PERSISTENCE_KEY = 'AuthTokenP';

@Injectable({ providedIn: 'root' })
export class SecurityService {

  public updated: Subject<SubjectModel> = new Subject<SubjectModel>();
  permissions = new Subject<string[]>();
  private sub: SubjectModel = null;

  constructor(private http: HttpClient) {
  }

  public get subject() {
    return this.sub;
  }

  public set subject(val: SubjectModel) {
    if (!val.avatar) {
      val.avatar = './assets/img/avatar-default.png';
    }
    if (val.nome) {
      val.firstName = val.nome.split(' ')[0];
    }
    this.sub = val;
  }

  public static clear() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  public static persistentOption(): boolean {
    return !!localStorage.getItem(PERSISTENCE_KEY);
  }

  public static saveToken(token: string, persistent: boolean) {
    SecurityService.clear();
    if (persistent) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }

    if (persistent) {
      localStorage.setItem(PERSISTENCE_KEY, 'true');
    } else {
      localStorage.removeItem(PERSISTENCE_KEY);
    }
  }

  public static getToken(): string {
    let tkn = sessionStorage.getItem(TOKEN_KEY);
    if (!tkn) {
      tkn = localStorage.getItem(TOKEN_KEY);
    }
    return tkn;
  }

  public load(): Observable<SubjectModel> {
    return this.http.get<SubjectModel>('api/auth/subject');
  }

  updateUserInfo(model: any) {
    for (const key in model) {
      this.sub[key] = model[key];
    }
    this.subject = this.sub;
    this.updated.next(this.sub);
  }
}
