"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Search, Download, MoreVertical } from 'lucide-react';

const users = [
  { id: 1, name: 'John Doe', email: 'john.smith@email.com', phone: '+1 (555) 123-4567', matches: 18, status: 'Active', joinDate: '2023-05-15', avatarColor: 'bg-primary' },
  { id: 2, name: 'Sarah Smith', email: 'emily.davis@email.com', phone: '+1 (555) 234-5678', matches: 22, status: 'Active', joinDate: '2023-06-20', avatarColor: 'bg-primary/90' },
  { id: 3, name: 'Mike Johnson', email: 'michael.brown@email.com', phone: '+1 (555) 345-6789', matches: 12, status: 'Active', joinDate: '2023-07-10', avatarColor: 'bg-primary/80' },
  { id: 4, name: 'Emily Brown', email: 'sarah.wilson@email.com', phone: '+1 (555) 456-7890', matches: 35, status: 'Active', joinDate: '2023-04-05', avatarColor: 'bg-primary/90' },
  { id: 5, name: 'David Wilson', email: 'john.smith@email.com', phone: '+1 (555) 123-4567', matches: 5, status: 'Active', joinDate: '2023-08-22', avatarColor: 'bg-primary' },
  { id: 6, name: 'Lisa Anderson', email: 'sarah.wilson@email.com', phone: '+1 (555) 456-7890', matches: 20, status: 'Active', joinDate: '2023-05-30', avatarColor: 'bg-primary/80' },
  { id: 7, name: 'Tom Martinez', email: 'sarah.wilson@email.com', phone: '+1 (555) 456-7890', matches: 14, status: 'Suspended', joinDate: '2023-07-15', avatarColor: 'bg-primary/90' },
  { id: 8, name: 'Tom Martinez', email: 'john.smith@email.com', phone: '+1 (555) 123-4567', matches: 14, status: 'Suspended', joinDate: '2023-07-15', avatarColor: 'bg-primary' },
  { id: 9, name: 'Tom Martinez', email: 'john.smith@email.com', phone: '+1 (555) 123-4567', matches: 14, status: 'Suspended', joinDate: '2023-07-15', avatarColor: 'bg-primary' },
  { id: 10, name: 'Tom Martinez', email: 'sarah.wilson@email.com', phone: '+1 (555) 456-7890', matches: 14, status: 'Suspended', joinDate: '2023-07-15', avatarColor: 'bg-primary/90' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );
};

export default function UsersManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Users Management</h1>
        <p className="text-sm text-text-muted mt-1">Manage all AthlonGo users</p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 border-none shadow-sm rounded-2xl bg-surface">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-9 bg-background border-border h-10 w-full"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-10 shadow-none">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </Card>

      <Card className="border-none shadow-sm rounded-2xl bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text font-medium border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email & Phone</th>
                <th scope="col" className="px-6 py-4">Matches</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Join Date</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="bg-surface hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 flex items-center justify-center rounded-full text-white font-medium ${user.avatarColor}`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text">{user.email}</div>
                    <div className="text-text-muted text-xs mt-1">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-text font-medium">{user.matches}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button variant="outline" size="sm" className="h-8 shadow-none bg-background text-text">
                          Preview
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
