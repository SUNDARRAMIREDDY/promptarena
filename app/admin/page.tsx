"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminRoute } from "@/components/admin-route";
import { Navbar } from "@/components/navbar";
import { AdminUsersTable } from "@/components/admin-users-table";
import { AdminSubmissionsTable } from "@/components/admin-submissions-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  apiGetAllUsers,
  apiGetAllSubmissions,
  type UserData,
  type AdminSubmissionData,
} from "@/lib/api-client";
import { Users, FileImage, Trophy } from "lucide-react";
import { toast } from "sonner";

function AdminDashboardContent() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [submissions, setSubmissions] = useState<
    Record<number, AdminSubmissionData[]>
  >({ 1: [], 2: [], 3: [] });
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  const fetchData = useCallback(async () => {
    // Fetch users and submissions in parallel
    const [usersRes, submissionsRes] = await Promise.all([
      apiGetAllUsers(),
      apiGetAllSubmissions(),
    ]);

    if (usersRes.error) {
      toast.error(`Users: ${usersRes.error}`);
    } else if (usersRes.data) {
      setUsers(usersRes.data.users);
    }
    setIsLoadingUsers(false);

    if (submissionsRes.error) {
      toast.error(`Submissions: ${submissionsRes.error}`);
    } else if (submissionsRes.data) {
      setSubmissions(submissionsRes.data.submissions);
      setTotalSubmissions(submissionsRes.data.total);
    }
    setIsLoadingSubmissions(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const participantCount = users.filter((u) => u.role === "user").length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage users, review submissions, and track competition rankings.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingUsers ? "..." : users.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoadingUsers ? "" : `${participantCount} participants`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Submissions
              </CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingSubmissions ? "..." : totalSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoadingSubmissions
                  ? ""
                  : `Across ${Object.values(submissions).filter((a) => a.length > 0).length} rounds`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingSubmissions || isLoadingUsers || participantCount === 0
                  ? "..."
                  : `${Math.round((totalSubmissions / (participantCount * 3)) * 100)}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoadingSubmissions
                  ? ""
                  : `${totalSubmissions} / ${participantCount * 3} possible`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList>
            <TabsTrigger value="submissions">
              Submissions & Rankings
            </TabsTrigger>
            <TabsTrigger value="users">Registered Users</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="mt-6">
            <AdminSubmissionsTable
              submissions={submissions}
              isLoading={isLoadingSubmissions}
              onDeleted={fetchData}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersTable users={users} isLoading={isLoadingUsers} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
