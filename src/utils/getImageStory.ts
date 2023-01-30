import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAi = new OpenAIApi(configuration);

const CreatePrompt = (prompt: string) => {
  const exampleResponse = JSON.stringify([
    {
      story: {
        title: "The story title",
        subTitle: "The story subtitle",
        description:
          "The story description MUST be at between 300-310 characters",
      },
      imagePrompt:
        "A group of astronauts in space suits standing on the surface of Mars, with the planet's rugged terrain and reddish sky visible in the background. The team is gathered around a large rover, which appears to be in the process of being loaded with equipment. In the foreground, one astronaut can be seen using a handheld device to collect data or take measurements. Another astronaut is looking through a telescope, while another is setting up a drill or other instrument. All the members of the team look focused and determined, ready to explore the unknown.",
    },
  ]);

  const engineeredPrompt = `Give me a short story using a image prompt
  I want this story to be about ${prompt}
  Give me the story in json format as a paragraph in an object in the array.
  The Story MUST be between 300-310 characters no more no less.
  Give me this in the same json object.
  Here is an example of how to format the frames of the storyboard: These frames need to be image prompts that can be used in a Image AI generation like Dall E 2 give very good descriptions of the image.
  Make the output in an json array like this:
  ${exampleResponse}
`;

  return engineeredPrompt;
};

type ExamplePrompt = [
  {
    story: {
      title: string;
      subTitle: string;
      description: string;
    };
    imagePrompt: string;
  }
];

const getImageStory = async (prompt: string) => {
  const engineeredPrompt = CreatePrompt(prompt);
  try {
    const response = await openAi.createCompletion({
      model: "text-davinci-003",
      prompt: engineeredPrompt,
      temperature: 0.8,
      max_tokens: 1297,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (response === undefined) {
      return "error";
    } else {
      const decodeResponse = response.data.choices[0]?.text;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decode: ExamplePrompt = JSON.parse(
        decodeResponse === undefined ? "" : decodeResponse
      );
      const imagePrompt = String(decode[0].imagePrompt);
      const image = await openAi.createImage({
        prompt: imagePrompt,
        n: 1,
        size: "256x256",
      });
      const url = image === undefined ? "" : image.data.data[0]?.url;

      const story = { image: url, story: decode[0].story };
      return story;
    }
  } catch (err) {
    console.log(err);
    return "error";
  }
};
export default getImageStory;
