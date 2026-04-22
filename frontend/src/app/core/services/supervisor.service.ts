import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DepartmentStatsResponse,
  OfficerPerformanceResponse,
  ComplaintHistoryResponse,
  UserResponse,
  AuditLogResponse
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class SupervisorService {
  private base = `${environment.apiUrl}/supervisor`;

  constructor(private http: HttpClient) {}

  getDepartmentComplaints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/department/complaints`);
  }

  getDepartmentStats(): Observable<DepartmentStatsResponse> {
    return this.http.get<DepartmentStatsResponse>(`${this.base}/department/stats`);
  }

  getDepartmentOfficers(): Observable<OfficerPerformanceResponse[]> {
    return this.http.get<OfficerPerformanceResponse[]>(`${this.base}/department/officers`);
  }

  getDepartmentOfficerUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.base}/department/officer-users`);
  }

  reassignComplaint(complaintId: number, officerId: number): Observable<any> {
    return this.http.put(`${this.base}/complaints/${complaintId}/assign`, { officerId });
  }

  updateStatus(complaintId: number, status: string, remarks?: string): Observable<any> {
    return this.http.put(`${this.base}/complaints/${complaintId}/status`, { status, remarks });
  }

  getComplaintHistory(complaintId: number): Observable<ComplaintHistoryResponse[]> {
    return this.http.get<ComplaintHistoryResponse[]>(`${this.base}/complaints/${complaintId}/history`);
  }

  getDepartmentAuditLogs(limit: number = 100): Observable<AuditLogResponse[]> {
    return this.http.get<AuditLogResponse[]>(`${this.base}/department/audit-logs?limit=${limit}`);
  }

  getExportCsvUrl(): string {
    return `${this.base}/department/export-csv`;
  }
}
