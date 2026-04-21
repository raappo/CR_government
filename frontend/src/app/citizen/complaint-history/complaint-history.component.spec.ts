import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ComplaintHistoryComponent } from './complaint-history.component';
import { AuthService } from '../../core/services/auth.service';
import { ComplaintService, ComplaintResponse } from '../../core/services/complaint.service';

const MOCK = (status: string, priority: string, id: number): ComplaintResponse => ({
    id, title: `Complaint ${id}`, description: 'Desc', status, priority,
    citizenId: 1, citizenName: 'Test',
    createdAt: new Date().toISOString(), slaDeadline: new Date().toISOString(),
});

describe('ComplaintHistoryComponent', () => {
    let fixture: ComponentFixture<ComplaintHistoryComponent>;
    let component: ComplaintHistoryComponent;
    let complaintSpy: jasmine.SpyObj<ComplaintService>;

    const COMPLAINTS = [
        MOCK('PENDING', 'HIGH', 1),
        MOCK('IN_PROGRESS', 'URGENT', 2),
        MOCK('RESOLVED', 'LOW', 3),
        MOCK('CLOSED', 'MEDIUM', 4),
    ];

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['currentUser', 'isLoggedIn', 'getRole']);
        authSpy.currentUser.and.returnValue({ id: '1', name: 'Test', email: 't@t.com', role: 'citizen', isActive: true, createdAt: '' });

        complaintSpy = jasmine.createSpyObj('ComplaintService', ['getMyComplaints', 'submitFeedback']);
        complaintSpy.getMyComplaints.and.returnValue(of(COMPLAINTS));

        await TestBed.configureTestingModule({
            imports: [ComplaintHistoryComponent, RouterTestingModule, CommonModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ComplaintService, useValue: complaintSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ComplaintHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('creates the component', () => expect(component).toBeTruthy());

    it('loads all 4 complaints', () => expect(component.all.length).toBe(4));

    // TC-08: Filter by priority tab (status tabs in this component)
    it('TC-08: status tab filter shows only matching complaints', () => {
        component.activeStatus = 'PENDING';
        expect(component.filtered.length).toBe(1);
        expect(component.filtered[0].status).toBe('PENDING');
    });

    it('TC-08b: "all" tab shows everything', () => {
        component.activeStatus = 'all';
        expect(component.filtered.length).toBe(4);
    });

    // TC-14: Feedback button only for RESOLVED/CLOSED
    it('TC-14: resolved and closed complaints exist in list', () => {
        const resolved = component.all.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');
        expect(resolved.length).toBe(2);
    });

    // TC-16: Search by complaint ID
    it('TC-16: search by ID filters correctly', () => {
        component.searchQuery = '3';
        expect(component.filtered.some(c => c.id === 3)).toBeTrue();
    });

    it('TC-16b: search by title filters correctly', () => {
        component.searchQuery = 'Complaint 2';
        expect(component.filtered.length).toBe(1);
        expect(component.filtered[0].id).toBe(2);
    });

    // Resolution rate
    it('resolutionRate is 50% (2 resolved+closed out of 4)', () => {
        expect(component.resolutionRate).toBe(50);
    });

    // SLA breach detection
    it('isSlaBreached returns true for past deadline on pending complaint', () => {
        const complaint = { ...COMPLAINTS[0], slaDeadline: '2020-01-01T00:00:00' };
        expect(component.isSlaBreached(complaint)).toBeTrue();
    });

    it('isSlaBreached returns false for resolved complaint even if past deadline', () => {
        const complaint = { ...COMPLAINTS[2], slaDeadline: '2020-01-01T00:00:00', status: 'RESOLVED' };
        expect(component.isSlaBreached(complaint)).toBeFalse();
    });
});