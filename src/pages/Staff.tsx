
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "@/services/dataService";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Staff = () => {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">কর্মচারীগণ</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>কর্মচারীদের তালিকা</CardTitle>
          <CardDescription>
            মাদ্রাসার সকল কর্মচারীর তথ্য
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              কোন কর্মচারী যোগ করা হয়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>পদবী</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead>বেতন</TableHead>
                    <TableHead>অবস্থা</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell>{staff.salary}</TableCell>
                      <TableCell>
                        {staff.active ? (
                          <span className="text-green-600">সক্রিয়</span>
                        ) : (
                          <span className="text-red-600">নিষ্ক্রিয়</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
