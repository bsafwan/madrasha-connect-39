
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { fetchDonations } from "@/services/dataService";
import { Donation } from "@/types";
import { useQuery } from "@tanstack/react-query";

const Donations = () => {
  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: fetchDonations
  });

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">দান-অনুদান</h2>
        <Button className="btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" /> নতুন দান যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>দান-অনুদান রেকর্ড</CardTitle>
          <CardDescription>
            মাদ্রাসায় আসা সকল দান-অনুদানের রেকর্ড
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-10 text-muted-foreground">
              লোড হচ্ছে...
            </div>
          )}
          
          {error && (
            <div className="text-center py-10 text-red-500">
              ডাটা লোড করতে সমস্যা হয়েছে
            </div>
          )}
          
          {donations && donations.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">দাতার নাম</th>
                      <th className="text-left py-3 px-2">পরিমাণ</th>
                      <th className="text-left py-3 px-2">তারিখ</th>
                      <th className="text-left py-3 px-2">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{donation.donorName}</td>
                        <td className="py-3 px-2">৳{donation.amount}</td>
                        <td className="py-3 px-2">{new Date(donation.date).toLocaleDateString('bn-BD')}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            donation.status === 'received' ? 'bg-green-100 text-green-800' : 
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {donation.status === 'received' ? 'প্রাপ্ত' : 
                             donation.status === 'pending' ? 'অপেক্ষমান' : 'বাতিল'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              কোন দান-অনুদানের রেকর্ড পাওয়া যায়নি
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Donations;
