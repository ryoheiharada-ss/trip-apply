"use client";

import { Layout } from "@/components/layout";
import { Header } from "@/components/header";
import { ProgressBar } from "@/components/progress-bar";
import { FormNavigation } from "@/components/form-navigation";
import { format, differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { FLOW_PATHS, PREFECTURES, ACCOMMODATION_RATES } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { travelRequestStep2Schema, TravelRequestStep2Data, travelRequestStep2IndividualSchema, TravelRequestStep2IndividualData } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { japaneseFilter } from "@/lib/japanese-search";

export default function TravelRequestStep2() {
  const searchParams = useSearchParams();
  const travelers = searchParams.getAll("travelers[]").filter(Boolean);
  const travelersType = searchParams.get("travelersType") || "same";
  
  const [searchValues, setSearchValues] = useState<string[]>([]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  // 個別行程の場合は複数のフォームを管理
  const forms = travelers.map((_, index) => 
    useForm<TravelRequestStep2IndividualData>({
      resolver: zodResolver(travelRequestStep2IndividualSchema),
      defaultValues: {
        stayNights: 0,
        stayLocations: [],
        accommodationFees: [],
        dateRange: { from: undefined, to: undefined },
      },
    })
  );

  // 同一行程の場合は1つのフォームのみ使用
  const sameItineraryForm = useForm<TravelRequestStep2IndividualData>({
    resolver: zodResolver(travelRequestStep2IndividualSchema),
    defaultValues: {
      stayNights: 0,
      stayLocations: [],
      accommodationFees: [],
      dateRange: { from: undefined, to: undefined },
    },
  });

  // 使用するフォームを決定
  const currentForms = travelersType === "different" ? forms : [sameItineraryForm];

  // 個別の行程の場合はCarouselで表示
  const shouldShowCarousel = travelers.length > 1 && travelersType === "different";

  // 都道府県の検索フィルター関数を修正
  const filteredPrefectures = (searchValue: string) => {
    return PREFECTURES.filter((prefecture) =>
      japaneseFilter(searchValue, prefecture.label)
    );
  };

  // useEffectの依存配列を修正し、無限ループを防ぐ
  useEffect(() => {
    if (travelersType === "different") {
      forms.forEach((form) => {
        const dateRange = form.getValues("dateRange");
        if (dateRange?.from && dateRange?.to) {
          const nights = differenceInDays(dateRange.to, dateRange.from);
          if (nights !== form.getValues("stayNights")) {
            form.setValue("stayNights", nights);
          }
        }
      });
    } else {
      const dateRange = sameItineraryForm.getValues("dateRange");
      if (dateRange?.from && dateRange?.to) {
        const nights = differenceInDays(dateRange.to, dateRange.from);
        if (nights !== sameItineraryForm.getValues("stayNights")) {
          sameItineraryForm.setValue("stayNights", nights);
        }
      }
    }
  }, [travelersType]);

  // 日付選択時のハンドラーを追加
  const handleDateRangeChange = (formIndex: number, dateRange: { from: Date; to: Date } | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      const nights = differenceInDays(dateRange.to, dateRange.from);
      if (travelersType === "different") {
        forms[formIndex].setValue("stayNights", nights);
      } else {
        sameItineraryForm.setValue("stayNights", nights);
      }
    }
  };

  // 都道府県選択時に宿泊費を更新する関数を追加
  const updateAccommodationFee = (formIndex: number, locationIndex: number, prefecture: string) => {
    const defaultFee = prefecture === "tokyo" ? ACCOMMODATION_RATES.tokyo : ACCOMMODATION_RATES.other;
    
    if (travelersType === "different") {
      const currentFees = forms[formIndex].getValues("accommodationFees");
      const newFees = [...currentFees];
      newFees[locationIndex] = defaultFee;
      forms[formIndex].setValue("accommodationFees", newFees);
    } else {
      const currentFees = sameItineraryForm.getValues("accommodationFees");
      const newFees = [...currentFees];
      newFees[locationIndex] = defaultFee;
      sameItineraryForm.setValue("accommodationFees", newFees);
    }
  };

  // 宿泊費が基準額を超過しているかチェックする関数を追加
  const checkExcessFee = (fees: number[], locations: string[]) => {
    return fees.some((fee, index) => {
      const isTokyoLocation = locations[index] === "tokyo";
      const baseRate = isTokyoLocation ? ACCOMMODATION_RATES.tokyo : ACCOMMODATION_RATES.other;
      return fee > baseRate;
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Header />
        <ProgressBar step={2} totalSteps={6} />
        
        {shouldShowCarousel ? (
          <Carousel className="w-full">
            <CarouselContent>
              {travelers.map((travelerName, formIndex) => (
                <CarouselItem key={formIndex}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        <h2 className="text-2xl font-semibold">{`${travelerName}さんの出張情報`}</h2>
                      </CardHeader>
                      <CardContent>
                        <Form {...forms[formIndex]}>
                          <form className="space-y-6">
                            <FormField
                              control={forms[formIndex].control}
                              name="dateRange"
                              render={({ field }) => (
                                <FormItem className="flex flex-col max-w-[50%]">
                                  <FormLabel>出張期間</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value?.from ? (
                                            field.value.to ? (
                                              <>
                                                {format(field.value.from, "yyyy/MM/dd")} -{" "}
                                                {format(field.value.to, "yyyy/MM/dd")}
                                              </>
                                            ) : (
                                              format(field.value.from, "yyyy/MM/dd")
                                            )
                                          ) : (
                                            <span>日付を選択してください</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        selected={field.value}
                                        onSelect={(value) => {
                                          field.onChange(value);
                                          handleDateRangeChange(formIndex, value as { from: Date; to: Date } | undefined);
                                        }}
                                        numberOfMonths={2}
                                        disabled={(date) => date < new Date()}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={forms[formIndex].control}
                              name="stayNights"
                              render={({ field }) => (
                                <FormItem className="max-w-[50%]">
                                  <FormLabel>宿泊日数</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      {...field}
                                      onChange={e => {
                                        const value = parseInt(e.target.value);
                                        field.onChange(value >= 0 ? value : 0);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {Array.from({ length: forms[formIndex].watch("stayNights") || 0 }).map((_, index) => (
                              <div key={index} className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={forms[formIndex].control}
                                  name={`stayLocations.${index}`}
                                  render={({ field }) => (
                                    <FormItem className="w-full">
                                      <FormLabel>宿泊地域 {index + 1}日目</FormLabel>
                                      <Select 
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          updateAccommodationFee(formIndex, index, value);
                                        }}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="都道府県を選択" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                          {PREFECTURES.map((prefecture) => (
                                            <SelectItem 
                                              key={prefecture.value} 
                                              value={prefecture.value}
                                            >
                                              {prefecture.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={forms[formIndex].control}
                                  name={`accommodationFees.${index}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>宿泊費 {index + 1}日目</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          value={field.value || 0} // 値がundefinedの場合のフォールバック
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}

                            {forms[formIndex].watch("accommodationFees")?.some((fee, index) => {
                              const location = forms[formIndex].watch(`stayLocations.${index}`);
                              const baseRate = location === "tokyo" ? ACCOMMODATION_RATES.tokyo : ACCOMMODATION_RATES.other;
                              return fee > baseRate;
                            }) && (
                              <FormField
                                control={forms[formIndex].control}
                                name="excessReason"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>超過理由</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="規定額を超過する理由を入力してください"
                                        className="resize-none"
                                        rows={3}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Step02：宿泊・移動情報の入力</h2>
              {travelersType === "same" && travelers.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  ※ {travelers.map(name => `${name}さん`).join("、")}の行程です
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Form {...sameItineraryForm}>
                <form className="space-y-6">
                  <FormField
                    control={sameItineraryForm.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="flex flex-col max-w-[50%]">
                        <FormLabel>出張期間</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, "yyyy/MM/dd")} -{" "}
                                      {format(field.value.to, "yyyy/MM/dd")}
                                    </>
                                  ) : (
                                    format(field.value.from, "yyyy/MM/dd")
                                  )
                                ) : (
                                  <span>日付を選択してください</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={(value) => {
                                field.onChange(value);
                                handleDateRangeChange(0, value as { from: Date; to: Date } | undefined);
                              }}
                              numberOfMonths={2}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={sameItineraryForm.control}
                    name="stayNights"
                    render={({ field }) => (
                      <FormItem className="max-w-[50%]">
                        <FormLabel>宿泊日数</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={e => {
                              const value = parseInt(e.target.value);
                              field.onChange(value >= 0 ? value : 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {Array.from({ length: sameItineraryForm.watch("stayNights") || 0 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <FormField
                        control={sameItineraryForm.control}
                        name={`stayLocations.${index}`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>宿泊地域 {index + 1}日目</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                updateAccommodationFee(0, index, value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="都道府県を選択"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[200px]">
                                {PREFECTURES.map((prefecture) => (
                                  <SelectItem 
                                    key={prefecture.value} 
                                    value={prefecture.value}
                                  >
                                    {prefecture.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={sameItineraryForm.control}
                        name={`accommodationFees.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>宿泊費 {index + 1}日目</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value || 0} // 値がundefinedの場合のフォールバック
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  {sameItineraryForm.watch("accommodationFees")?.some((fee, index) => {
                    const location = sameItineraryForm.watch(`stayLocations.${index}`);
                    const baseRate = location === "tokyo" ? ACCOMMODATION_RATES.tokyo : ACCOMMODATION_RATES.other;
                    return fee > baseRate;
                  }) && (
                    <FormField
                      control={sameItineraryForm.control}
                      name="excessReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>超過理由</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="規定額を超過する理由を入力してください"
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <FormNavigation 
          currentPath={FLOW_PATHS.STEP2}
          queryParams={{
            "travelers[]": travelers,
            travelersType
          }}
        />
      </div>
    </Layout>
  );
}
