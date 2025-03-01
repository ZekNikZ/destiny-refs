import { z } from "zod";

export interface WOMPunishment {
  // Properties
  id: string;
  text: string;
  weight: number;
  extraSpins: number;
  tags: string[];

  // TODO: Visuals
  // weapon?: number;
  // icon?: string;

  // Calculated
  children?: WOMPunishment[];
}
export const WOMPunishmentSchema: z.ZodType<WOMPunishment> = z.lazy(() =>
  z.object({
    // Properties
    id: z.string(),
    text: z.string(),
    weight: z.number(),
    extraSpins: z.number(),
    tags: z.array(z.string()),

    // TODO: Visuals
    //   weapon: z.number().optional(),
    //   icon: z.string().optional(),

    // Calculated
    children: z.array(WOMPunishmentSchema).optional(),
  })
);

export const WOMPunishmentListSchema = z.object({
  id: z.string(),
  name: z.string(),
  punishments: z.array(WOMPunishmentSchema),
});
export type WOMPunishmentList = z.infer<typeof WOMPunishmentListSchema>;

export type WOMFireteamMember = { punishments: WOMPunishment[] } & (
  | {
      source: "manual";
      username: string;
      membershipId?: undefined;
      emblemHash?: undefined;
    }
  | {
      source: "fireteam";
      username: string;
      membershipId: string;
      emblemHash: number;
    }
);
