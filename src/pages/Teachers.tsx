
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTeachers } from "@/services/dataService";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Teachers = () => {
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">শিক্ষকগণ</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>শিক্ষকদের তালিকা</CardTitle>
          <CardDescription>
            মাদ্রাসার সকল শিক্ষকের তথ্য
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              কোন শিক্ষক যোগ করা হয়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead>যোগ্যতা</TableHead>
                    <TableHead>বিশেষত্ব</TableHead>
                    <TableHead>বেতন</TableHead>
                    <TableHead>অবস্থা</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.qualification || '-'}</TableCell>
                      <TableCell>{teacher.specialty || '-'}</TableCell>
                      <TableCell>{teacher.salary}</TableCell>
                      <TableCell>
                        {teacher.active ? (
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

export default Teachers;
