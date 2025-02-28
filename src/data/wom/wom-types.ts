import { z } from "zod";

export interface WOMPunishment {
  // Properties
  text: string;
  weight?: number;
  extraSpins?: number;
  tags?: string[];

  // TODO: Visuals
  // weapon?: number;
  // icon?: string;

  // Calculated
  children?: WOMPunishment[];
}
export const WOMPunishmentSchema: z.ZodType<WOMPunishment> = z.lazy(() =>
  z.object({
    // Properties
    text: z.string(),
    weight: z.number().optional(),
    extraSpins: z.number().optional(),
    tags: z.array(z.string()).optional(),

    // TODO: Visuals
    //   weapon: z.number().optional(),
    //   icon: z.string().optional(),

    // Calculated
    children: z.array(WOMPunishmentSchema).optional(),
  })
);

export const WOMPunishmentListSchema = z.object({
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
