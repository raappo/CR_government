import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { CitizenDashboardComponent } from './citizen-dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { ComplaintService } from '../../core/services/complaint.service';

const MOCK_COMPLAINTS = [
    {
        id: 1, title: 'Test 1', description: 'Desc', status: 'PENDING', priority: 'HIGH',
        citizenId: 1, citizenName: 'Test', createdAt: new Date().toISOString(), slaDeadline: new Date().toISOString()
    },
    {
        id: 2, title: 'Test 2', description: 'Desc', status: 'RESOLVED', priority: 'LOW',
        citizenId: 1, citizenName: 'Test', createdAt: new Date().toISOString(), slaDeadline: new Date().toISOString()
    },
];

describe('CitizenDashboardComponent', () => {
    let fixture: ComponentFixture<CitizenDashboardComponent>;
    let component: CitizenDashboardComponent;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['currentUser', 'logout', 'isLoggedIn', 'getRole']);
        authSpy.currentUser.and.returnValue({ id: '1', name: 'Test User', email: 't@t.com', role: 'citizen', isActive: true, createdAt: '' });
        authSpy.isLoggedIn.and.returnValue(true);
        authSpy.getRole.and.returnValue('citizen');

        const complaintSpy = jasmine.createSpyObj('ComplaintService', ['getMyComplaints']);
        complaintSpy.getMyComplaints.and.returnValue(of(MOCK_COMPLAINTS));

        await TestBed.configureTestingModule({
            imports: [CitizenDashboardComponent, RouterTestingModule, CommonModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ComplaintService, useValue: complaintSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CitizenDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('creates the component', () => expect(component).toBeTruthy());

    // TC-13: Dashboard loads complaints from API
    it('TC-13: loads complaints from API on init', () => {
        expect(component.complaints.length).toBe(2);
    });

    it('TC-13b: stat counts are correct', () => {
        expect(component.pendingCount).toBe(1);  // 1 PENDING
        expect(component.resolvedCount).toBe(1); // 1 RESOLVED
    });

    // TC-14: Feedback button visible only for RESOLVED
    it('TC-14: recentComplaints includes resolved complaint', () => {
        const resolved = component.recentComplaints.find(c => c.status === 'RESOLVED');
        expect(resolved).toBeTruthy();
    });

    it('firstName returns first word of name', () => {
        expect(component.firstName).toBe('Test');
    });

    it('getInitials returns correct initials', () => {
        expect(component.getInitials()).toBe('TU');
    });

    it('formatStatus converts PENDING to Pending', () => {
        expect(component.formatStatus('PENDING')).toBe('Pending');
        expect(component.formatStatus('IN_PROGRESS')).toBe('In Progress');
    });
});