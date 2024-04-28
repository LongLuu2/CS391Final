import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: 'sk-proj-uLzhpCqo7bD7A78GDd9tT3BlbkFJQgtKcfcMqYPpzUrXDHai',
	dangerouslyAllowBrowser: true,
});

{/*
Example setup for calling openAI api
Reference Used: (https://platform.openai.com/docs/api-reference/chat/create)
1. Add import statement
	import { main } from "./CombineLogic"

2. Prep data to be passed to function main(...) w/ content being the Movies
	const movieA = 'Finding Nemo';
    const movieB = 'Star Wars';
    const content = `Movie A: ${movieA}. Movie B: ${movieB}`;
    const [buttonText, setButtonText] = useState("New Cards");
    const handleClick = async() => {
        const newButtonText = await main(content);
        setButtonText(newButtonText.slice(4));
    };

3. Example Implementation: Button when clicked passes movieA & movieB and gets returned movieC which populates
   buttonText
	<StyledButton onClick={handleClick}>
		{buttonText}
	</StyledButton>
*/}

export async function main(content) {

	const completion = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				"role": "system", "content": "You are a function that ingests information about two different" +
					" movies, \"Movie A\" & \"Movie B\" and returns a third movie \"Movie C\" that is most similar /" +
					" relevant to the two given movies. IMPORTANT: Return just the movie Title and nothing else in" +
					" the format \"Movie C:<Insert Movie Title>\"."
			},
			{"role": "user", "content": content}
		],
		stream: true,
	});

	let movieTitles = [];

	for await (const chunk of completion) {
		console.log(chunk.choices[0].delta.content);
		movieTitles.push(chunk.choices[0].delta.content);
	}

	return movieTitles;
}

main();