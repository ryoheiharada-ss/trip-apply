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
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { japaneseFilter } from "@/lib/japanese-search";

export default function TravelRequestStep1() {
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [travelType, setTravelType] = useState("");
  
  const form = useForm({
    resolver: zodResolver(travelRequestStep1Schema),
    defaultValues: {
      applicantName: "",
      department: "",
      numberOfTravelers: 1,
      travelers: [""],
      travelersType: "same",
      travelType: "",
      purpose: "",
      destination: "",
    },
  });

  const numberOfTravelers = form.watch("numberOfTravelers");
  const showMultipleTravelers = numberOfTravelers > 1;

  // フィルタリング関数を修正
  const filteredDepartments = useMemo(() => 
    DEPARTMENTS.filter(department => 
      japaneseFilter(departmentSearch, department.label)
    ),
    [departmentSearch]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <Header />
        <ProgressBar step={1} totalSteps={6} />
        
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Step01： 出張基本申請情報の入力</h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="applicantName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col max-w-[50%]">
                      <FormLabel>申請者名</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="flex flex-col max-w-[50%]">
                      <FormLabel>費用負担部門</FormLabel>
                      <Popover 
                        open={departmentPopoverOpen} 
                        onOpenChange={setDepartmentPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={departmentPopoverOpen}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? DEPARTMENTS.find(
                                    (department) => department.value === field.value
                                  )?.label
                                : "部門を選択してください"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[min(100%,400px)] p-0">
                          <Command>
                            <CommandInput 
                              placeholder="部門を検索..." 
                              value={departmentSearch}
                              onValueChange={setDepartmentSearch}
                            />
                            <CommandEmpty>部門が見つかりません。</CommandEmpty>
                            <CommandGroup>
                              {filteredDepartments.map((department) => (
                                <CommandItem
                                  key={department.value}
                                  onSelect={() => {
                                    field.onChange(department.value);
                                    setDepartmentPopoverOpen(false);
                                    setDepartmentSearch("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === department.value 
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {department.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfTravelers"
                  render={({ field }) => (
                    <FormItem className="flex flex-col max-w-[50%]">
                      <FormLabel>出張者人数</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={10}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="bg-muted">
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="travelers.0"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>出張者名 1</FormLabel>
                          <FormControl>
                            <Input
                            placeholder="出張者名"
                            className="bg-white"
                            {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showMultipleTravelers && (
                      <>
                        {Array.from({ length: numberOfTravelers - 1 }).map((_, index) => (
                          <FormField
                            key={index + 1}
                            control={form.control}
                            name={`travelers.${index + 1}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>出張者名 {index + 2}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="出張者名"
                                    className="bg-white"
                                    {...field}
                                    value={field.value || ""} // 値がundefinedの場合は空文字を使用
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        
                        <FormField
                          control={form.control}
                          name="travelersType"
                          render={({ field }) => (
                            <FormItem className="bg-white p-4 rounded-md"> {/* 背景色と余白を追加 */}
                              <FormLabel>出張内容</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="same" id="same" />
                                    <Label htmlFor="same">全員同一の行程</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="different" id="different" />
                                    <Label htmlFor="different">個別の行程</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>

                <FormField
                  control={form.control}
                  name="travelType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col max-w-[50%]">
                      <FormLabel>出張分類</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setTravelType(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="出張分類を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAVEL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>出張目的</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="出張の目的を入力してください" 
                          className="resize-none min-h-[120px]"
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-[50%]">
                      <FormLabel>出張先</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={
                            TRAVEL_TYPES.find(type => type.value === travelType)?.destinationPlaceholder || 
                            "出張先を入力してください"
                          } 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <FormNavigation 
          currentPath={FLOW_PATHS.STEP1} 
          queryParams={{
            "travelers[]": form.watch("travelers").filter(Boolean),
            travelersType: form.watch("travelersType") || "same"
          }}
        />
      </div>
    </Layout>
  );
}
