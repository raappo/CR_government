import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComplaintService } from './complaint.service';
import { environment } from '../../../environments/environment';

const MOCK_COMPLAINT = {
    id: 1, title: 'Test', description: 'Test desc', status: 'PENDING',
    priority: 'HIGH', citizenId: 1, citizenName: 'Test',
    createdAt: new Date().toISOString(), slaDeadline: new Date().toISOString(),
};

describe('ComplaintService', () => {
    let service: ComplaintService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(ComplaintService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    // TC-07: Admin sees all complaints
    it('TC-07: getAllComplaints calls /api/admin/complaints', () => {
        service.getAllComplaints().subscribe((data) => {
            expect(data.length).toBe(1);
            expect(data[0].status).toBe('PENDING');
        });
        const req = http.expectOne(`${environment.apiUrl}/admin/complaints`);
        expect(req.request.method).toBe('GET');
        req.flush([MOCK_COMPLAINT]);
    });

    // TC-16: Search by ID (formatStatus helper)
    it('TC-16: formatStatus converts IN_PROGRESS to In Progress', () => {
        expect(ComplaintService.formatStatus('IN_PROGRESS')).toBe('In Progress');
        expect(ComplaintService.formatStatus('PENDING')).toBe('Pending');
        expect(ComplaintService.formatStatus('RESOLVED')).toBe('Resolved');
        expect(ComplaintService.formatStatus('CLOSED')).toBe('Closed');
        expect(ComplaintService.formatStatus('ASSIGNED')).toBe('Assigned');
    });

    it('getMyComplaints calls /api/citizen/my-complaints', () => {
        service.getMyComplaints().subscribe();
        http.expectOne(`${environment.apiUrl}/citizen/my-complaints`);
    });

    it('getMyTasks calls /api/officer/my-tasks', () => {
        service.getMyTasks().subscribe();
        http.expectOne(`${environment.apiUrl}/officer/my-tasks`);
    });

    it('createComplaint calls /api/citizen/complaints with POST', () => {
        const req = { title: 'T', description: 'Desc', priority: 'HIGH' as const };
        service.createComplaint(req).subscribe();
        const r = http.expectOne(`${environment.apiUrl}/citizen/complaints`);
        expect(r.request.method).toBe('POST');
        r.flush(MOCK_COMPLAINT);
    });

    it('assignOfficer calls PUT /api/admin/complaints/:id/assign', () => {
        service.assignOfficer(1, 5).subscribe();
        const r = http.expectOne(`${environment.apiUrl}/admin/complaints/1/assign`);
        expect(r.request.method).toBe('PUT');
        expect(r.request.body).toEqual({ officerId: 5 });
        r.flush(MOCK_COMPLAINT);
    });

    it('updateTaskStatus calls PUT /api/officer/tasks/:id/status', () => {
        service.updateTaskStatus(1, 'RESOLVED').subscribe();
        const r = http.expectOne(`${environment.apiUrl}/officer/tasks/1/status`);
        expect(r.request.method).toBe('PUT');
        r.flush(MOCK_COMPLAINT);
    });
});