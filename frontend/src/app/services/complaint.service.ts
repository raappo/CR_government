import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { API_BASE_URL, APP_STORAGE_KEYS } from '../core/config/api.config';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../models/complaint.model';
import { User } from '../models/user.model';

export interface ComplaintPayload {
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  citizenId: number;
  citizenName: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly http = inject(HttpClient);

  getCitizenComplaints(citizenId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${API_BASE_URL}/citizen/complaints`).pipe(
      catchError(() => of(this.readComplaints().filter((complaint) => complaint.citizenId === citizenId)))
    );
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${API_BASE_URL}/admin/complaints`).pipe(
      catchError(() => of(this.readComplaints()))
    );
  }

  getAssignedComplaints(officerName: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${API_BASE_URL}/officer/tasks`).pipe(
      catchError(() =>
        of(this.readComplaints().filter((complaint) => complaint.assignedOfficerName === officerName))
      )
    );
  }

  createComplaint(payload: ComplaintPayload): Observable<Complaint> {
    return this.http.post<Complaint>(`${API_BASE_URL}/citizen/complaints`, payload).pipe(
      catchError(() => this.mockCreateComplaint(payload))
    );
  }

  updateComplaintStatus(
    complaintId: number,
    status: ComplaintStatus,
    note: string,
    proofImageUrl?: string
  ): Observable<Complaint> {
    return this.http.patch<Complaint>(`${API_BASE_URL}/officer/complaints/${complaintId}`, { status, note, proofImageUrl }).pipe(
      catchError(() => {
        const complaints = this.readComplaints();
        const updated = complaints.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                status,
                updatedAt: new Date().toISOString(),
                proofImageUrl: proofImageUrl ?? complaint.proofImageUrl,
                timeline: [
                  ...complaint.timeline,
                  { label: status, timestamp: new Date().toISOString(), note }
                ]
              }
            : complaint
        );

        this.writeComplaints(updated);
        return of(updated.find((complaint) => complaint.id === complaintId) as Complaint).pipe(delay(300));
      })
    );
  }

  assignOfficer(complaintId: number, officer: User): Observable<Complaint> {
    return this.http.patch<Complaint>(`${API_BASE_URL}/admin/complaints/${complaintId}/assign`, { officerId: officer.id }).pipe(
      catchError(() => {
        const complaints = this.readComplaints();
        const updated = complaints.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                status: 'ASSIGNED' as ComplaintStatus,
                assignedOfficerId: officer.id,
                assignedOfficerName: officer.name,
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...complaint.timeline,
                  {
                    label: 'ASSIGNED',
                    timestamp: new Date().toISOString(),
                    note: `Assigned to ${officer.name}`
                  }
                ]
              }
            : complaint
        );

        this.writeComplaints(updated);
        return of(updated.find((complaint) => complaint.id === complaintId) as Complaint).pipe(delay(300));
      })
    );
  }

  saveFeedback(complaintId: number, rating: number, comments: string): Observable<Complaint> {
    return this.http.post<Complaint>(`${API_BASE_URL}/citizen/complaints/${complaintId}/feedback`, { rating, comments }).pipe(
      catchError(() => {
        const complaints = this.readComplaints();
        const updated = complaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, feedbackRating: rating, feedbackComments: comments }
            : complaint
        );
        this.writeComplaints(updated);
        return of(updated.find((complaint) => complaint.id === complaintId) as Complaint);
      })
    );
  }

  getComplaintById(id: number): Observable<Complaint | undefined> {
    return this.getAllComplaints().pipe(map((complaints) => complaints.find((complaint) => complaint.id === id)));
  }

  private mockCreateComplaint(payload: ComplaintPayload): Observable<Complaint> {
    const complaints = this.readComplaints();
    const createdAt = new Date();
    const complaint: Complaint = {
      id: complaints.length + 1,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: 'PENDING',
      department: payload.category,
      citizenId: payload.citizenId,
      citizenName: payload.citizenName,
      imageUrl: payload.imageUrl,
      latitude: payload.latitude,
      longitude: payload.longitude,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      slaDeadline: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      timeline: [
        {
          label: 'PENDING',
          timestamp: createdAt.toISOString(),
          note: 'Complaint raised successfully'
        }
      ]
    };

    this.writeComplaints([complaint, ...complaints]);
    return of(complaint).pipe(delay(400));
  }

  private readComplaints(): Complaint[] {
    const stored = localStorage.getItem(APP_STORAGE_KEYS.complaints);
    if (stored) {
      return JSON.parse(stored) as Complaint[];
    }

    const seeded = this.seedComplaints();
    this.writeComplaints(seeded);
    return seeded;
  }

  private writeComplaints(complaints: Complaint[]): void {
    localStorage.setItem(APP_STORAGE_KEYS.complaints, JSON.stringify(complaints));
  }

  private seedComplaints(): Complaint[] {
    const now = new Date();
    return [
      {
        id: 101,
        title: 'Garbage not collected in Ward 8',
        description: 'Waste bins have been overflowing for three days near the market road.',
        category: 'Solid Waste',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        department: 'Solid Waste',
        citizenId: 1,
        citizenName: 'Asha Verma',
        assignedOfficerId: 2,
        assignedOfficerName: 'Ravi Kumar',
        latitude: 12.9716,
        longitude: 77.5946,
        createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        slaDeadline: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
        timeline: [
          { label: 'PENDING', timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), note: 'Complaint filed by citizen' },
          { label: 'ASSIGNED', timestamp: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(), note: 'Assigned to Ravi Kumar' },
          { label: 'IN_PROGRESS', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), note: 'Field team dispatched' }
        ]
      },
      {
        id: 102,
        title: 'Streetlight outage near school zone',
        description: 'The entire lane beside the government school is dark after 7 PM.',
        category: 'Street Lighting',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        department: 'Street Lighting',
        citizenId: 1,
        citizenName: 'Asha Verma',
        assignedOfficerId: 2,
        assignedOfficerName: 'Ravi Kumar',
        latitude: 12.975,
        longitude: 77.599,
        createdAt: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        slaDeadline: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
        proofImageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
        timeline: [
          { label: 'PENDING', timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(), note: 'Complaint filed' },
          { label: 'ASSIGNED', timestamp: new Date(now.getTime() - 90 * 60 * 60 * 1000).toISOString(), note: 'Assigned to lighting team' },
          { label: 'IN_PROGRESS', timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), note: 'Repair in progress' },
          { label: 'RESOLVED', timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), note: 'Streetlight restored' }
        ],
        feedbackRating: 5,
        feedbackComments: 'Quick resolution and clear updates.'
      }
    ];
  }
}
