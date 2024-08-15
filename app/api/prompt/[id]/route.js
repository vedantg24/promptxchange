import { connectDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET (read post)
export const GET = async (request, { params }) => {
	try {
		await connectDB();

		const prompt = await Prompt.findById(params.id).populate("creator");

		if (!prompt) return new Response("Prompt not found", { status: 404 });

		return new Response(JSON.stringify(prompt), { status: 200 });
	} catch (error) {
		return new Response("Failed to fetch all prompts", { status: 500 });
	}
};

// PATCH (update post)
export const PATCH = async (req, { params }) => {
	const { prompt, tag } = await req.json();
	try {
		await connectDB();

		const existingPrompt = await Prompt.findById(params.id);

		if (!existingPrompt)
			return new Response("Prompt not found", { status: 404 });

		existingPrompt.prompt = prompt;
		existingPrompt.tag = tag;

		await existingPrompt.save();

		return new Response(JSON.stringify(existingPrompt), { status: 200 });
	} catch (error) {
		return new Response("Failed to fetch all prompts", { status: 500 });
	}
};

// DELETE (delete post)
export const DELETE = async (request, { params }) => {
	try {
		await connectDB();

		// Find the prompt by ID and delete it
		await Prompt.findByIdAndDelete(params.id);

		return new Response("Prompt deleted successfully", { status: 200 });
	} catch (error) {
		return new Response("Error deleting prompt", { status: 500 });
	}
};
