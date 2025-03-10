import * as z from "zod"

export const travelRequestStep1Schema = z.object({
  applicantName: z.string().min(1, { message: "申請者名を入力してください" }),
  department: z.string().min(1, { message: "部門を選択してください" }),
  numberOfTravelers: z.number().min(1).max(10),
  travelers: z.array(z.string().min(1, { message: "出張者名を入力してください" })),
  travelersType: z.enum(["same", "different"]).optional(),
  travelType: z.string().min(1, { message: "出張分類を選択してください" }),
  purpose: z.string().min(1, { message: "出張目的を入力してください" }),
  destination: z.string().optional(),
})

export type TravelRequestStep1Data = z.infer<typeof travelRequestStep1Schema>

export const travelRequestStep2IndividualSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "開始日を選択してください",
    }),
    to: z.date({
      required_error: "終了日を選択してください",
    }),
  }),
  stayNights: z.number().min(0),
  stayLocations: z.array(z.string()),
  accommodationFees: z.array(z.number()),
  excessReason: z.string().optional(),
}).refine((data) => data.dateRange.to > data.dateRange.from, {
  message: "終了日は開始日より後の日付を選択してください",
  path: ["dateRange"],
});

export type TravelRequestStep2IndividualData = z.infer<typeof travelRequestStep2IndividualSchema>

export const travelRequestStep2Schema = z.union([
  // 同一行程の場合は1つのデータ
  travelRequestStep2IndividualSchema,
  // 個別行程の場合は配列でデータを管理
  z.array(travelRequestStep2IndividualSchema)
]);

export type TravelRequestStep2Data = z.infer<typeof travelRequestStep2Schema>
