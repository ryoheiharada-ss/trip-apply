"use client";

import { Layout } from "@/components/layout";
import { Header } from "@/components/header";
import { ProgressBar } from "@/components/progress-bar";
import { FormNavigation } from "@/components/form-navigation";
import { FLOW_PATHS, DEPARTMENTS, TRAVEL_TYPES } from "@/lib/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { travelRequestStep1Schema } from "@/lib/schema";
import { useState } from "react";

export default function TravelRequestStep1() {
  const [travelType, setTravelType] = useState("");
  const form = useForm({
    resolver: zodResolver(travelRequestStep1Schema),
    defaultValues: {
      numberOfTravelers: 1,
      travelers: [""], // デフォルトで1名分の配列を初期化
    },
  });

  const numberOfTravelers = form.watch("numberOfTravelers");
  const showMultipleTravelers = numberOfTravelers > 1;

  return (
    <Layout>
      <div className="space-y-6">
        <Header />
        <ProgressBar step={3} totalSteps={6} />
        
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">基本情報の入力</h2>
          </CardHeader>
          <CardContent>
            {/* ここにフォーム入れる */}
          </CardContent>
        </Card>

        <FormNavigation currentPath={FLOW_PATHS.STEP3} />
      </div>
    </Layout>
  );
}
