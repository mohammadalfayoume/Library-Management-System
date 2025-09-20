import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookBriefDto, BookCreateDto, BookUpdateDto } from '../../shared/models/book.model';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../shared/models/paged.list';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly apiUrl = `${environment.apiUrl}/api/books`;


  constructor(private http: HttpClient) {}

  getAllPaged(page: number = 1, pageSize: number = 10): Observable<PagedResult<BookBriefDto>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<BookBriefDto>>(this.apiUrl + `/getAll`, { params });
  }

  getById(id: string): Observable<BookBriefDto> {
    return this.http.get<BookBriefDto>(this.apiUrl + `/getById/${id}`);
  }

  create(book: BookCreateDto): Observable<BookBriefDto> {
    return this.http.post<BookBriefDto>(this.apiUrl + '/create', book);
  }

  update(book: BookUpdateDto): Observable<BookBriefDto> {
    return this.http.post<BookBriefDto>(this.apiUrl + `/update`, book);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/delete/${id}`);
  }
}