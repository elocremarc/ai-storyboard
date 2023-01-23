import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import getImageStory from "../../../utils/getImageStory";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  imageStory: publicProcedure.query(async ({ input }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.log(input);
    const { image, story } = await getImageStory(
      "nine bells who are also magical girls are in danger. can the heros save them before their father destroys the city?"
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message: { image, story },
    };
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
