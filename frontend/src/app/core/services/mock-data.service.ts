import { Injectable } from '@angular/core';
import { User, Officer, Department_ } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  readonly mockUsers: User[] = [
    {
      id: 'u1', name: 'Rajesh Kumar', email: 'citizen@demo.com', phone: '9876543210',
      address: '42, MG Road, Bengaluru - 560001', role: 'citizen',
      createdAt: '2024-01-15', isActive: true
    },
    {
      id: 'u3', name: 'Anand Verma', email: 'officer@demo.com', phone: '9876543212',
      address: 'Corporation Office, Bengaluru', role: 'officer',
      createdAt: '2023-10-01', isActive: true
    },
    {
      id: 'u4', name: 'Suresh Babu', email: 'admin@demo.com', phone: '9876543213',
      address: 'BBMP HQ, Bengaluru', role: 'admin',
      createdAt: '2023-08-01', isActive: true
    },
  ];

  readonly departments: Department_[] = [
    {
      id: 'd1', name: 'Roads & Infrastructure', head: 'K. Murthy',
      totalComplaints: 12450, resolved: 10820, pending: 1630, avgResolutionDays: 4.2
    },
    {
      id: 'd2', name: 'Water & Sanitation', head: 'S. Reddy',
      totalComplaints: 9830, resolved: 8960, pending: 870, avgResolutionDays: 2.8
    },
    {
      id: 'd3', name: 'Solid Waste Management', head: 'P. Naik',
      totalComplaints: 8210, resolved: 7640, pending: 570, avgResolutionDays: 1.5
    },
    {
      id: 'd4', name: 'Electricity', head: 'R. Gowda',
      totalComplaints: 6540, resolved: 6100, pending: 440, avgResolutionDays: 1.2
    },
    {
      id: 'd5', name: 'Street Lighting', head: 'M. Das',
      totalComplaints: 4320, resolved: 3980, pending: 340, avgResolutionDays: 3.1
    },
    {
      id: 'd6', name: 'Health & Sanitation', head: 'Dr. A. Kumar',
      totalComplaints: 3210, resolved: 2940, pending: 270, avgResolutionDays: 5.0
    },
    {
      id: 'd7', name: 'Traffic & Transport', head: 'V. Nair',
      totalComplaints: 2980, resolved: 2710, pending: 270, avgResolutionDays: 6.4
    },
    {
      id: 'd8', name: 'Parks & Recreation', head: 'S. Joshi',
      totalComplaints: 1870, resolved: 1720, pending: 150, avgResolutionDays: 7.2
    },
  ];

  readonly officers: Officer[] = [
    {
      id: 'o1', name: 'Anand Verma', email: 'a.verma@bbmp.gov.in',
      department: 'Roads & Infrastructure', employeeId: 'BBMP/R/2019/0041',
      assignedComplaints: 18, resolvedComplaints: 11, isActive: true
    },
    {
      id: 'o2', name: 'Meena Krishnan', email: 'm.krishnan@bbmp.gov.in',
      department: 'Water & Sanitation', employeeId: 'BBMP/W/2018/0089',
      assignedComplaints: 14, resolvedComplaints: 9, isActive: true
    },
    {
      id: 'o3', name: 'Ravi Shankar', email: 'r.shankar@bbmp.gov.in',
      department: 'Solid Waste Management', employeeId: 'BBMP/S/2020/0033',
      assignedComplaints: 22, resolvedComplaints: 17, isActive: true
    },
    {
      id: 'o4', name: 'Deepa Nair', email: 'd.nair@bbmp.gov.in',
      department: 'Street Lighting', employeeId: 'BBMP/L/2017/0055',
      assignedComplaints: 10, resolvedComplaints: 8, isActive: true
    },
    {
      id: 'o5', name: 'Sanjay Patel', email: 's.patel@bbmp.gov.in',
      department: 'Health & Sanitation', employeeId: 'BBMP/H/2021/0012',
      assignedComplaints: 8, resolvedComplaints: 5, isActive: false
    },
  ];
}
