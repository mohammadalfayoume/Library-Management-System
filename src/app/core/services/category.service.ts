import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryBriefDto, CategoryCreateDto, CategoryUpdateDto } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/paged.list';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  getAllPaged(page: number = 1, pageSize: number = 10): Observable<PagedResult<CategoryBriefDto>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<CategoryBriefDto>>(this.apiUrl + `/getAllPaged`, { params });
  }

  getAll(): Observable<CategoryBriefDto[]> {
    return this.http.get<CategoryBriefDto[]>(this.apiUrl + `/getAll`);
  }

  getById(id: string): Observable<CategoryBriefDto> {
    return this.http.get<CategoryBriefDto>(this.apiUrl + `/getById/${id}`);
  }

  create(category: CategoryCreateDto): Observable<CategoryBriefDto> {
    return this.http.post<CategoryBriefDto>(this.apiUrl + `/create`, category);
  }

  update(category: CategoryUpdateDto): Observable<CategoryBriefDto> {
    return this.http.post<CategoryBriefDto>(this.apiUrl + `/update`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/delete/${id}`);
  }
}